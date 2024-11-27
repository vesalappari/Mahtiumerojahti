import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private apiUrl = 'http://192.168.1.108:3000/game';

  constructor(
    private http: HttpClient,
    protected storageService: StorageService,
  ) { }

  getAllGames(): Observable<{id: number, userName: string, secretNumber: number, isGuessed: boolean, attempts: number}> {
    const headers = this.getAuthHeaders();
    return this.http.get<{id: number, userName: string, secretNumber: number, isGuessed: boolean, attempts: number}>(`${this.apiUrl}`,{headers});
  }

  getStatistics(): Observable<{ averageOfGuesses: number, totalGames: number }> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ averageOfGuesses: number, totalGames: number }>(`${this.apiUrl}/stats-general`,{headers});
  }

  getUserStatistics(userName: string): Observable<{averageOfGuesses: number, totalGames: number}> {
    const headers = this.getAuthHeaders();
    return this.http.get<{averageOfGuesses: number, totalGames: number}>(`${this.apiUrl}/stats-user/${userName}`, {headers});
  }

  clearAllGames(): Observable<{ message: string }> {
    const headers = this.getAuthHeaders();
    return this.http.post<{ message: string }>(`${this.apiUrl}/clear-all`, {},{headers});
  }

  deleteGame(gameId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/delete/${gameId}`,{headers});
  }


  getAllGamesByUser(filterUserName: string) {
    const headers = this.getAuthHeaders();
    return this.http.get<{id: number, userName: string, secretNumber: number, isGuessed: boolean, attempts: number}>(`${this.apiUrl}/user/${filterUserName}`, {headers});
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.storageService.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
