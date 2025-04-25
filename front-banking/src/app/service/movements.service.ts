import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovementsService {

  private apiUrl = 'http://localhost:8080';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'x-guid': '511e8470-e19b-42d4-a7e6-4466ftw40000',
      'x-device': '12354',
      'x-device-ip': '192.168.7.7',
      'x-session': 'dsds1212'
    })
  };

  constructor(private http: HttpClient) { }

  visualizarMovements(identification: any, start: any, end: any) {
    const url = `${this.apiUrl}/v1/find-customer-by-date?id=${identification}&startDate=${start}&endDate=${end}`;
    console.log(url);
    
    return this.http.get<any>(url, this.httpOptions);
  }



  createMovement(movimiento: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+"/v1/add-movements", movimiento, this.httpOptions);
  }


}
