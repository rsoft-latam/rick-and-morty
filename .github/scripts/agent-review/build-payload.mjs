#!/usr/bin/env node
/**
 * build-payload.mjs
 * - Reads PR context from GITHUB_EVENT_PATH
 * - Lists changed files via GitHub API
 * - Fetches file contents at PR head SHA
 * - Outputs a single JSON payload to stdout
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const EVENT_PATH = process.env.GITHUB_EVENT_PATH;

if (!GITHUB_TOKEN) {
  console.error("Missing GITHUB_TOKEN env var");
  process.exit(1);
}
if (!EVENT_PATH) {
  console.error("Missing GITHUB_EVENT_PATH env var");
  process.exit(1);
}

const DEFAULTS = {
  examLevel: process.env.EXAM_LEVEL || "mid",
  maxFiles: parseInt(process.env.MAX_FILES || "10", 10),
  maxTotalChars: parseInt(process.env.MAX_TOTAL_CHARS || "200000", 10),
  allowedExt: (process.env.ALLOWED_EXT || ".ts,.html,.scss,.md").split(",").map(s => s.trim()).filter(Boolean),
};

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

async function ghFetch(url, { method = "GET", body } = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      "Authorization": `Bearer ${GITHUB_TOKEN}`,
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GitHub API error ${res.status} ${res.statusText} for ${url}\n${text}`);
  }
  return res.json();
}

function isAllowedFile(filename) {
  return DEFAULTS.allowedExt.some(ext => filename.toLowerCase().endsWith(ext));
}

function clipString(str, maxChars) {
  if (!str) return "";
  if (str.length <= maxChars) return str;
  return str.slice(0, maxChars);
}

async function listAllPRFiles(owner, repo, prNumber) {
  const perPage = 100;
  let page = 1;
  const all = [];

  while (true) {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files?per_page=${perPage}&page=${page}`;
    const batch = await ghFetch(url);
    all.push(...batch);
    if (batch.length < perPage) break;
    page += 1;
  }

  return all;
}

async function getRepoContent(owner, repo, filePath, refSha) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(filePath)}?ref=${refSha}`;
  const data = await ghFetch(url);

  // If directory, skip
  if (Array.isArray(data)) return "";

  const enc = data.encoding;
  const b64 = data.content || "";
  if (enc !== "base64" || !b64) return "";

  // decode base64 -> utf8
  return Buffer.from(b64, "base64").toString("utf8");
}

async function main() {
  const event = readJson(EVENT_PATH);
  const pr = event.pull_request;

  if (!pr) {
    console.error("This workflow must run on pull_request events.");
    process.exit(1);
  }

  const repoFull = event.repository?.full_name;
  const [owner, repo] = repoFull.split("/");
  const prNumber = pr.number;
  const baseSha = pr.base?.sha;
  const headSha = pr.head?.sha;

  // 1) list changed files
  const prFiles = await listAllPRFiles(owner, repo, prNumber);

  const picked = prFiles
    .filter(f => isAllowedFile(f.filename))
    .filter(f => f.status !== "removed")
    .slice(0, DEFAULTS.maxFiles)
    .map(f => ({
      filename: f.filename,
      status: f.status,
      patch: f.patch || "", // can be empty/truncated
    }));

  // 2) fetch contents for each file at HEAD
  const files = [];
  let totalChars = 0;

  for (const f of picked) {
    if (totalChars >= DEFAULTS.maxTotalChars) break;

    const content = await getRepoContent(owner, repo, f.filename, headSha);

    const remaining = Math.max(0, DEFAULTS.maxTotalChars - totalChars);
    const clipped = clipString(content, remaining);
    totalChars += clipped.length;

    files.push({
      filename: f.filename,
      status: f.status,
      patch: f.patch,
      content: clipped,
    });
  }

  const payload = {
    repo: repoFull,
    pr_number: prNumber,
    base_sha: baseSha,
    head_sha: headSha,
    exam_level: DEFAULTS.examLevel,
    files,
    limits: {
      max_files: DEFAULTS.maxFiles,
      max_total_chars: DEFAULTS.maxTotalChars,
      allowed_ext: DEFAULTS.allowedExt,
    },
  };

  process.stdout.write(JSON.stringify(payload));
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exit(1);
});
