import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchasesBillsService {

  private baseUrl = `${environment.baseUrl}/purchasesBills`;

  constructor(private http: HttpClient) { }

  getAllPagination(params:any): Observable<any> {
    return this.http.get(`${this.baseUrl}/pageable`, { params });
  }

  getBillsCode(): Observable<any> {
    return this.http.get(`${this.baseUrl}/nextCode`);
  }

  create(object: any,supplierId:any): Observable<any>  {
    return this.http.post(`${this.baseUrl}?supplierId=${supplierId}`, object);
  }

}
