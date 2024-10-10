import {Component, OnDestroy, OnInit} from '@angular/core';
import { GameService } from "../game.service";
import { LanguageService } from "../services/language.service";
import confetti from "canvas-confetti";
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  gameId: number | null = null;
  guess: number | null | undefined;
  attempts: number = 0;
  guessedNumbers: number[] = [];
  gameRunning: boolean = false;
  closeGuess: boolean = false;

  showModal: boolean = false;
  modalMessage: string = '';
  showWinningAnimation: boolean = false;
  currentUser: User | null = null;

  constructor(
    private gameService: GameService,
    protected languageService: LanguageService,
    protected userService: UserService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.reset();
    this.userService.currentUser.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  startGame() {
    if (this.currentUser?.userName) {
      this.gameService.startGame(this.currentUser?.userName).subscribe(data => {
        this.gameId = data.gameId;
        this.languageService.messageKey = this.languageService.getMessage('placeGuess');
        this.attempts = 0;
        this.guess = null;
        this.guessedNumbers = [];
        this.gameRunning = true;
      });
    } else {
      alert('Please set user before starting game')
    }
  }

  reset() {
    this.languageService.messageKey = this.languageService.getMessage('placeGuess');
    this.attempts = 0;
    this.guess = null;
    this.guessedNumbers = [];
    this.closeGuess = false;
  }

  async makeGuess() {
    this.showModal = false;
    if (this.gameId && this.guess) {
      if (this.guess < 1 || this.guess > 100) {
        this.showModalMessage(this.languageService.getMessage('falseGuess'), 4000)
      } else {
        if (this.guess && this.gameRunning && !this.isInGuessed(this.guess)) {
          this.guessedNumbers.push(this.guess);
          this.guessedNumbers = this.guessedNumbers.sort((a, b) => a - b);
          this.gameService.guessNumber(this.gameId, this.guess).subscribe(result => {
            this.attempts = result.attempts;
            if (result.correct) {
              this.languageService.messageKey = this.languageService.getMessage('correctGuess', { attempts: this.attempts });
              this.gameRunning = false;
              this.closeGuess = false;
              this.triggerWinningAnimation();
            } else if (result.lower) {
              this.languageService.messageKey = this.languageService.getMessage('lowGuess');
            } else if (result.higher) {
              this.languageService.messageKey = this.languageService.getMessage('highGuess');
            }

            if (result.close && !result.correct) {
              this.closeGuess = true;
              this.showModalMessage(this.languageService.getMessage('closeGuess'), 2000)
            }
          });
        } else if (this.guess && this.isInGuessed(this.guess) && this.gameRunning) {
          this.showModalMessage(this.languageService.getMessage('isGuessed'),2000);
        } else if (this.guess && !this.gameRunning) {
          this.showModalMessage(this.languageService.getMessage('gameOverMessage'), 2000);
        }
      }
    }
  }

  isInGuessed(num: number) {
    return this.guessedNumbers.includes(num);
  }

  showModalMessage(message: string, time: number) {
    if (!this.showWinningAnimation) {
      this.modalMessage = message;
      this.showModal = true;

      setTimeout(() => {
        this.showModal = false;
      }, time);
    }
  }

  triggerWinningAnimation() {
    this.showModal = false;
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 }
    });
    this.showWinningAnimation = true;

    setTimeout(() => {
      this.showWinningAnimation = false;
    }, 3500);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
