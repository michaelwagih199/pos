import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RetrivalsService {

  private baseUrl = `${environment.baseUrl}/retrievals`;

  constructor(private http: HttpClient) { }

  getAllPagination(params:any): Observable<any> {
    return this.http.get(`${this.baseUrl}/pageable`, { params });
  }

  getBillsCode(): Observable<any> {
    return this.http.get(`${this.baseUrl}/nextCode`);
  }

  create(object: any,customerName:any): Observable<any>  {
    return this.http.post(`${this.baseUrl}?customerName=${customerName}`, object);
  }

}
