import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailsService {

  private baseUrl = `${environment.baseUrl}/saleOrderDetails`;

  constructor(private http: HttpClient) { }

  checkIfItemNotEnough(object: any): Observable<any>  {
    return this.http.post(`${this.baseUrl}/ifItemNotEnough`, object);
  }

  checkIfAlertItem(object: any): Observable<any>  {
    return this.http.post(`${this.baseUrl}/ifAlertItem`, object);
  }


  createOrderDetails(orderCode:any,object: any):Observable<any>{
    return this.http.post(`${this.baseUrl}?orderCode=${orderCode}`,object);
  }

  
}
