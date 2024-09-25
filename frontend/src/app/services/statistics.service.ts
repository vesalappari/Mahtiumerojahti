import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private apiUrl = 'http://localhost:3000/game';

  constructor(
    private http: HttpClient
  ) { }

  getAllGames(): Observable<{id: number, secretNumber: number, isGuessed: boolean, attempts: number}> {
    //return this.http.get(`${this.apiUrl}`);
    return this.http.get<{id: number, secretNumber: number, isGuessed: boolean, attempts: number}>(`${this.apiUrl}`);

  }

  getTotalCountOfGames(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
}
