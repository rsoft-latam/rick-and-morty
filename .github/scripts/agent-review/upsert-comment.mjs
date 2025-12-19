#!/usr/bin/env node
/**
 * upsert-comment.mjs
 * - Reads agent JSON result from a file path passed as argv[2]
 * - Creates or updates a single PR comment (marker-based)
 *
 * Requires: GITHUB_TOKEN, GITHUB_EVENT_PATH
 */

import fs from "node:fs";
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

const resultPath = process.argv[2];
if (!resultPath) {
  console.error("Usage: node upsert-comment.mjs <result.json>");
  process.exit(1);
}

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

async function listAllIssueComments(owner, repo, issueNumber) {
  const perPage = 100;
  let page = 1;
  const all = [];

  while (true) {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments?per_page=${perPage}&page=${page}`;
    const batch = await ghFetch(url);
    all.push(...batch);
    if (batch.length < perPage) break;
    page += 1;
  }
  return all;
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

  const result = readJson(resultPath);

  // Marker to find/update existing comment
  const marker = "<!-- angular-agent-review -->";

  // If your agent returns a different key, change it here:
  const summary = result.summary_md || result.report_md || result.comment_md || null;

  const body =
`${marker}

## 🤖 Angular RAG Review

${summary ? summary : "✅ Review completed (no summary returned)."}

<sub>Triggered by PR update • head: \`${pr.head?.sha?.slice(0, 7) || "?"}\`</sub>
`;

  const comments = await listAllIssueComments(owner, repo, prNumber);

  // Update first matching bot comment
  const existing = comments.find(c =>
    c.user?.type === "Bot" &&
    typeof c.body === "string" &&
    c.body.includes(marker)
  );

  if (existing) {
    await ghFetch(`https://api.github.com/repos/${owner}/${repo}/issues/comments/${existing.id}`, {
      method: "PATCH",
      body: { body },
    });
  } else {
    await ghFetch(`https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`, {
      method: "POST",
      body: { body },
    });
  }

  console.log("PR comment upserted successfully.");
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exit(1);
});
