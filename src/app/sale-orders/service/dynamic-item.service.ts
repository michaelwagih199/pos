import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DynamicItemService {

  private baseUrl = `${environment.baseUrl}/dynamicDetails`;

  constructor(private http: HttpClient) { }

  findDynamic(productCode: any,
    paymentTypeId: any,
    orderTypeId: any,
    installmentPercentage: any): Observable<any> {
    return this.http.get(`${this.baseUrl}?productCode=${productCode}&paymentTypeId=${paymentTypeId}&orderTypeId=${orderTypeId}&installmentPercentage=${installmentPercentage}`);
  }

}
