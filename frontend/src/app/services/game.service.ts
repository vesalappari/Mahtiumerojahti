import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})

export class GameService {
  private apiUrl = 'http://192.168.1.108:3000/game';
  showGame: boolean = false;

  constructor(
    private http: HttpClient,
    protected storageService: StorageService,
  ) { }

  startGame(userName: string | undefined): Observable<{ gameId: number }> {
    const headers = this.getAuthHeaders();
    return this.http.post<{ gameId: number }>(`${this.apiUrl}/start`, {userName}, {headers});
  }

  guessNumber(gameId: number, guess: number)
    : Observable<{
    correct: boolean,
    close: boolean,
    lower: boolean,
    higher: boolean,
    attempts: number }> {
    const headers = this.getAuthHeaders();
    return this.http.post<{
      correct: boolean,
      close: boolean,
      lower: boolean,
      higher: boolean,
      attempts: number}>(`${this.apiUrl}/guess/${gameId}`, { guess },{headers});
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.storageService.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
