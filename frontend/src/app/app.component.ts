import {Component, OnInit} from '@angular/core';
import {LanguageService} from "./services/language.service";
import {StatisticsService} from "./services/statistics.service";
import {UserService} from "./services/user.service";
import {User} from "./models/user.model";
import {GameService} from "./game.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Mahtinumerojahti';
  showStatisticsModal: boolean = false;
  currentUser: User | null = null;
  showUserModal: boolean = false;
  showLogout: boolean = false;

  constructor(
      protected languageService: LanguageService,
      protected statisticsService: StatisticsService,
      protected userService: UserService,
      protected gameService: GameService,
      private router: Router,
  ) {}

  ngOnInit() {
    this.languageService.currentLanguage.subscribe(language => {
      this.title = this.languageService.getMessage(this.languageService.messageKey);
    });
    this.userService.currentUser.subscribe((user: User | null) => {
      this.currentUser = user;
    });
    if (!this.currentUser?.userName) {
      this.router.navigate(['/dashboard']);
    }

  }

  openUserModal() {
    this.showUserModal = true;
  }

  closeUserModal() {
    this.showUserModal = false;
    this.closeLogout();
  }

  logoutUser() {
    this.userService.setCurrentUser(null);
    this.closeUserModal();
    this.router.navigate(['/login']);
  }

  changeLanguage(event: Event) {
    const selectedLanguage = (event.target as HTMLSelectElement).value;
    this.languageService.setLanguage(selectedLanguage);
  }

  openStatisticsModal() {
    this.showStatisticsModal = true;
  }

  closeStatisticsModal() {
    this.showStatisticsModal = false;
  }

  showUserAuth() {
    this.userService.showUserAuth = true;
  }

  openLogout() {
    this.showLogout = true;
  }

  closeLogout() {
    this.showLogout = false;
  }

  onToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
