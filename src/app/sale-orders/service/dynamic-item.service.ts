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
    quantity:number,
    installmentPercentage: any): Observable<any> {
    //http://localhost:8080/api/dynamicDetails?productCode=1010800901&paymentTypeId=1&orderTypeId=2&quantity=11&installmentPercentage=30
    return this.http.get(`${this.baseUrl}?productCode=${productCode}&paymentTypeId=${paymentTypeId}&orderTypeId=${orderTypeId}&quantity=${quantity}&installmentPercentage=${installmentPercentage}`);
  }

}
