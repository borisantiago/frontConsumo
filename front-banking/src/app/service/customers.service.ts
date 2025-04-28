import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  private apiUrl = 'http://localhost:8080';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'x-guid': '550e8777-e29b-41d4-a716-446655440000',
      'x-device': '12354', 
      'x-device-ip': '192.168.7.7',
      'x-session': 'dsds1212'
    })
  };

  constructor(private http: HttpClient) {}
  
  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+"/v1/customers", this.httpOptions);
  }

  findCustomer(valor: any): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl+"/v1/find-customer", valor, this.httpOptions);
  }

  createCustomer(cliente: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+"/v1/add-customer", cliente, this.httpOptions);
  }

  updateCustomer(cliente: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+"/v1/update-customer", cliente, this.httpOptions);
  }

  deleteCustomer(id: string): Observable<any> {
    return this.http.delete<any>(this.apiUrl + "/v1/delete-customer?id="+id, this.httpOptions);
  }
  
}