import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:3000/game';
  showGame: boolean = false;

  constructor(
    private http: HttpClient
  ) { }

    startGame(userName: string | undefined): Observable<{ gameId: number }> {
    return this.http.post<{ gameId: number }>(`${this.apiUrl}/start`, {userName});
  }

  guessNumber(gameId: number, guess: number)
    : Observable<{
    correct: boolean,
    close: boolean,
    lower: boolean,
    higher: boolean,
    attempts: number }> {
    return this.http.post<{
      correct: boolean,
      close: boolean,
      lower: boolean,
      higher: boolean,
      attempts: number}>(`${this.apiUrl}/guess/${gameId}`, { guess });
  }
}
