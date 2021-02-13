import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = `${environment.baseUrl}/saleOrders`;

  constructor(private http: HttpClient) { }

  getOrderCode():Observable<any> {
    return this.http.get(`${this.baseUrl}/nextCode`);
  }

}
