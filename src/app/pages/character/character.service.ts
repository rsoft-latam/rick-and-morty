// ANGULAR
import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
// RXJS
import {BehaviorSubject, Observable} from 'rxjs';
// OTHERS
import {CharacterFilter} from "./character-filter.model";
import {environment} from "../../../environments/environment";
import {createRequestOption} from "../../shared/utils/request-util";

@Injectable()
export class CharacterService {

  apiBaseUrl = environment.app.apiBaseUrl;
  private filter = new BehaviorSubject<any>(new CharacterFilter());

  constructor(private http: HttpClient) {
  }

  sendFilter(object: any): void {
    this.filter.next(object);
  }

  currentFilter(): Observable<any> {
    return this.filter.asObservable();
  }

  getFilter(): any {
    return this.filter.getValue();
  }

  getCharacters(page: CharacterFilter): Observable<HttpResponse<any>> {
    const params = createRequestOption(page);
    return this.http.get(`${this.apiBaseUrl}character/`, {params: params, observe: 'response'});
  }

}
