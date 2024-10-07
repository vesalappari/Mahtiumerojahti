import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";
import {Router} from "@angular/router";
import {LanguageService} from "../services/language.service";

@Component({
  selector: 'app-dasbboard',
  templateUrl: './dasbboard.component.html',
  styleUrl: './dasbboard.component.css'
})
export class DasbboardComponent implements OnInit{

  currentUser: User | null = null;

  constructor(
      private userService: UserService,
      private languageService: LanguageService,
      private router: Router,
  ) {}

  async ngOnInit() {
    await this.userService.getCurrentUser().subscribe((resp: any) => {
      this.currentUser = resp;
    });
    if (!this.currentUser?.userName)
      await this.router.navigate(['/login'])
  }

  onToGame() {
    this.router.navigate(['/game']);
  }

  onToLogin() {
    this.router.navigate(['/login']);
  }
}
