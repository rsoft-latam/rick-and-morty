import {HttpParams} from '@angular/common/http';

export const createRequestOption = (req: any): HttpParams => {
  let options: HttpParams = new HttpParams();
  Object.keys(req).forEach((key) => {
    if (req[key]) {
      options = options.set(key, req[key]);
    }
  });
  return options;
};
