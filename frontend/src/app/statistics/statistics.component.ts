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

  totalCountOfGames: number = 0;
  allGames: any[] = [];
  averageGuesses: number = 0;
  showConfirmButton: boolean = false;
  showListOfGames: boolean = false
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(
    protected statisticsService: StatisticsService,
    protected languageService: LanguageService,
  ) {}

  async ngOnInit() {
    this.update();
  }

  async update() {
    this.getAllGames().subscribe(games => {
      this.allGames = games;
      this.calculateAverageGuesses();
      this.checkCurrentPage();
    });
    this.getTotalCountOfGames().subscribe(totalCount => {
      this.totalCountOfGames = totalCount;
    });
  }

  checkCurrentPage(){
    let maxPage = Math.ceil(this.allGames.length / this.itemsPerPage);
    if(this.currentPage > maxPage){
      this.currentPage = maxPage === 0 ? 1 : maxPage;
    }
  }

  getTotalCountOfGames(): Observable<number> {
    return this.statisticsService.getTotalCountOfGames();
  }

  getAllGames(): Observable<any> {
    return this.statisticsService.getAllGames();
  }

  private calculateAverageGuesses() {
    const totalAttempts = this.allGames.reduce((total: number, game: any) => total + game.attempts, 0);
    if (this.allGames.length > 0) {
      this.averageGuesses = Math.round(totalAttempts / this.allGames.length);
    } else {
      this.averageGuesses = 0;
    }
  }

  clearAllGames() {
    this.statisticsService.clearAllGames().subscribe(
        (response) => {
          this.update();
        },
        (error) => {
          alert('Failed to clear all games');
        }
    );
  }

  showConfirm() {
    this.showConfirmButton = true;
    setTimeout(() => {
      this.hideConfirm();
    }, 4000);
  }

  hideConfirm() {
    this.showConfirmButton = false;
  }

  toggleListOfGames() {
    this.showListOfGames = !this.showListOfGames;
  }

  removeGame(gameId: number) {
    this.statisticsService.deleteGame(gameId).subscribe(
        response => {
          this.update();
        },
        error => alert('Failed to delete game')
    );
  }

  get maxPage() {
    return Math.ceil(this.allGames.length / this.itemsPerPage);
  }
}
