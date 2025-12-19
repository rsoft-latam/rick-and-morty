// ANGULAR
import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
// RXJS
import {Observable} from 'rxjs';
// OTHERS
import {environment} from "../../../environments/environment";

@Injectable()
export class EpisodeDetailsService {

  apiBaseUrl = environment.app.apiBaseUrl;

  constructor(private http: HttpClient) {
  }

  getEpisodeById(id: number): Observable<HttpResponse<any>> {
    return this.http.get(`${this.apiBaseUrl}episode/${id}`, {observe: 'response'});
  }

}
