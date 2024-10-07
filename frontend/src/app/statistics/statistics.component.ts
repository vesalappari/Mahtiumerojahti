import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {StatisticsService} from "../services/statistics.service";
import {LanguageService} from "../services/language.service";
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";

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
  ) {}

  async ngOnInit() {
    if (this.userService.currentUser) {
      this.userService.currentUser.subscribe((user: User | null) => {
        this.currentUser = user;
      });
    }
    await this.update()
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
    this.getGames().subscribe(games => {
      this.games = games;
      this.checkCurrentPage();
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

  async removeGame(gameId: number) {
    console.log(gameId);
    this.statisticsService.deleteGame(gameId).subscribe(
        response => {
          this.update();
        },
        error => alert('Failed to delete game')
    );
  }

  get maxPage() {
    if (this.getFilteredGames().length > 0 || this.filterUserName.length > 0) {
      return Math.ceil(this.getFilteredGames().length / this.itemsPerPage);
    } else {
      return Math.ceil(this.games.length / this.itemsPerPage);
    }
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
