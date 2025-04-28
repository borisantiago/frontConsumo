import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

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

  constructor(private http: HttpClient) { }

  createAccount(cuenta: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+"/v1/add-account", cuenta, this.httpOptions);
  }

  deleteAccount(id: any): Observable<any> {
    return this.http.delete<any>(this.apiUrl + "/v1/delete-account?id="+id, this.httpOptions);
  }
}
