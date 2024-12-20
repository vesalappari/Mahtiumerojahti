import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {StatisticsService} from "../services/statistics.service";
import {LanguageService} from "../services/language.service";
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";
import {StateService} from "../services/state.service";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit, OnChanges, OnDestroy{

  protected totalCountOfGames: number = 0;
  protected games: any[] = [];
  protected averageGuesses: number = 0;
  protected showConfirmButton: boolean = false;
  protected showListOfGames: boolean = false
  protected currentPage: number = 1;
  protected itemsPerPage: number = 5;
  protected filterUserName: string = '';
  public timeoutId: any | undefined;
  protected currentUser: User | null = null;
  protected statsSubscription!: Subscription;

  constructor(
    protected statisticsService: StatisticsService,
    protected languageService: LanguageService,
    protected userService: UserService,
    protected stateService: StateService,

  ) {}

  async ngOnInit() {
    this.stateService.startLoading()
    if (this.userService.currentUser) {
      this.userService.currentUser.subscribe((user: User | null) => {
        this.currentUser = user;
      });
    }
    await this.update().then(() =>
        this.stateService.stopLoading());
    if (this.games) {
      this.showListOfGames = true;
    } else this.showListOfGames = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterUserName']) {
      this.currentPage = 1;
    }
  }

  ngOnDestroy() {
    this.statsSubscription && this.statsSubscription.unsubscribe();
  }


  async update() {
    return new Promise((resolve) => {
      this.getGames().subscribe(games => {
        this.games = games;
        this.checkCurrentPage();
        resolve(null);
      });
    });
  }

  checkCurrentPage(){
    if (this.currentPage > this.maxPage) {
      this.currentPage = this.maxPage, 0 ? 1 : this.maxPage;
    }
  }

  getStatistics() {
    this.statsSubscription && this.statsSubscription.unsubscribe();

    if (this.filterUserName) {
      this.statsSubscription = this.statisticsService.getUserStatistics(this.filterUserName).subscribe(
          stats => {
            this.averageGuesses = stats.averageOfGuesses;
            this.totalCountOfGames = stats.totalGames;
          });
    } else {
      this.statsSubscription = this.statisticsService.getStatistics().subscribe(
          (stats) => {
            this.averageGuesses = stats.averageOfGuesses;
            this.totalCountOfGames = stats.totalGames;
          });
    }
  }

  getGames(): Observable<any> {
    if (this.filterUserName) {
      return this.statisticsService.getAllGamesByUser(this.filterUserName);
    } else {
      return this.statisticsService.getAllGames();
    }
  }

  getFilteredGames() {
    if (!this.filterUserName.trim()) {
      this.getStatistics();
      return this.games;
    } else {
      this.getStatistics();
      return this.games.filter(game => game.userName.toLowerCase().includes(this.filterUserName.toLowerCase()));
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


  removeGame(gameId: number) {
    this.statisticsService.deleteGame(gameId).subscribe(
        response => {
          const index = this.games.findIndex(game => game.id === gameId);
          if (index !== -1) {
            this.games.splice(index, 1);
          }
        },
        error => alert(error)
    );
  }

  get maxPage() {
    if (this.getFilteredGames().length > 0 || this.filterUserName.length > 0) {
      return Math.ceil(this.getFilteredGames().length / this.itemsPerPage);
    } else {
      return Math.ceil(this.games.length / this.itemsPerPage);
    }
  }

  protected getVisiblePageNumbers() {
    let startPage: number;
    let endPage: number;

    if (this.maxPage <= 5) {
      startPage = 1;
      endPage = this.maxPage;
    } else {
      if (this.currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (this.currentPage + 2 >= this.maxPage) {
        startPage = this.maxPage - 4;
        endPage = this.maxPage;
      } else {
        startPage = this.currentPage - 2;
        endPage = this.currentPage + 2;
      }
    }

    let visiblePageNumbers = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);
    return visiblePageNumbers;
  }

  public get allUserNames(): string[] {
    const allUserNames = this.games?.map(game => game.userName);
    return [...new Set(allUserNames)];
  }

  public startTimer(game: any): void {
    this.timeoutId = setTimeout(() => {
      game.isHovered = true;
    }, 1000);
  }

  public stopTimer(): void {
    clearTimeout(this.timeoutId);
    this.getFilteredGames().forEach(game => game.isHovered = false);
  }

  clearFilterUserName() {
    this.filterUserName = '';
    this.currentPage = 1;
  }
}
