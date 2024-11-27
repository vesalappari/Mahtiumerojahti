import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";
import {Router} from "@angular/router";
import {LanguageService} from "../services/language.service";
import {StateService} from "../services/state.service";

@Component({
  selector: 'app-dasbboard',
  templateUrl: './dasbboard.component.html',
  styleUrl: './dasbboard.component.css'
})
export class DasbboardComponent implements OnInit{

  currentUser: User | null = null;

  constructor(
      private userService: UserService,
      protected languageService: LanguageService,
      private router: Router,
      protected stateService: StateService,
  ) {}

  async ngOnInit() {
    this.stateService.startLoading();
    this.userService.getCurrentUser().subscribe((resp: any) => {
      this.currentUser = resp;
      this.stateService.stopLoading();
    });
    if (!this.currentUser?.userName){
      this.stateService.startLoading();
      await this.router.navigate(['/login'])
      this.stateService.stopLoading();
    }
  }

  onToGame() {
    this.stateService.startLoading();
    this.router.navigate(['/game']).then(() =>
        this.stateService.stopLoading()); // Stop loading after navigation
  }

  onToLogin() {
    this.stateService.startLoading();
    this.router.navigate(['/login']).then(() =>
        this.stateService.stopLoading()); // Stop loading after navigation
  }
}
