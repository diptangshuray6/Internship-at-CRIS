import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RailwayService {
  private jsonUrl = 'http://localhost:3000/api/routes';

  constructor(private http:HttpClient) { }

  getRailwayData(): Observable<any>{
    return this.http.get(`${this.jsonUrl}/getData`);
  }

  data: any={};

}
