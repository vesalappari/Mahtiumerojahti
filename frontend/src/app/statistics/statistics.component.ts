import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {StatisticsService} from "../services/statistics.service";
import {LanguageService} from "../services/language.service";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit {

  totalCountOfGames: number | undefined;
  allGames: any;
  averageGuesses: string | undefined;

  constructor(
    protected statisticsService: StatisticsService,
    protected languageService: LanguageService,
  ) {}

  async ngOnInit() {
    this.update();
  }

  update() {
    this.getAllGames().subscribe(games => {
      this.allGames = games;
      this.calculateAverageGuesses();
    });
    this.getTotalCountOfGames().subscribe(totalCount => {
      this.totalCountOfGames = totalCount;
    });
  }

  getTotalCountOfGames(): Observable<number> {
    return this.statisticsService.getTotalCountOfGames();
  }

  getAllGames(): Observable<any> {
    return this.statisticsService.getAllGames();
  }

  private calculateAverageGuesses() {
    const totalAttempts = this.allGames.reduce((total: number, game: any) => total + game.attempts, 0);
    this.averageGuesses = (totalAttempts / this.allGames.length).toFixed(0);
  }
}