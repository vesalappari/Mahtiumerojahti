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

  getAllGames(): Observable<{id: number, userName: string, secretNumber: number, isGuessed: boolean, attempts: number}> {
    return this.http.get<{id: number, userName: string, secretNumber: number, isGuessed: boolean, attempts: number}>(`${this.apiUrl}`);
  }

  getTotalCountOfGames(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  getStatistics(): Observable<{ averageOfGuesses: number, totalGames: number }> {
    return this.http.get<{ averageOfGuesses: number, totalGames: number }>(`${this.apiUrl}/stats-general`);
  }

  getUserStatistics(userName: string): Observable<{averageOfGuesses: number, totalGames: number}> {
    return this.http.get<{averageOfGuesses: number, totalGames: number}>(`${this.apiUrl}/stats-user/${userName}`);
  }
  /*
  getStatistics(): Observable<{ averageOfGuesses: number, totalGames: number }> {
    return this.http.get<{ averageOfGuesses: number, totalGames: number }>(`${this.apiUrl}/stats`);
  }

   */

  clearAllGames(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/clear-all`, {});
  }

  deleteGame(gameId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${gameId}`);
  }


  getAllGamesByUser(filterUserName: string) {
    return this.http.get<{id: number, userName: string, secretNumber: number, isGuessed: boolean, attempts: number}>(`${this.apiUrl}/user/${filterUserName}`);
  }
}
