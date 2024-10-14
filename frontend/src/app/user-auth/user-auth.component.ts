import { Component } from '@angular/core';
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";
import {GameService} from "../game.service";
import {LanguageService} from "../services/language.service";
import {Router} from "@angular/router";
import {response} from "express";

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.css',
})
export class UserAuthComponent {

    registerUserName: string = '';
    registerPassword: string = '';
    confirmPassword: string = '';
    isAdmin: boolean = false;
    isLoginUserShown: boolean = true;
    isRegisterUserShown: boolean = false;

    loginUserName: string = '';
    loginPassword: string = '';

    message: string = '';
    hoveringOverCreateNewUserButton: boolean = false;
    hoveringOverLoginButton: boolean = false;

    constructor(
        protected userService: UserService,
        protected gameService: GameService,
        protected languageService: LanguageService,
        private router: Router
    ) {}

    registerUser() {
        const newUser: User = {
            userName: this.registerUserName,
            password: this.registerPassword,
            isAdmin: this.isAdmin,
        };

        if (this.registerPassword === this.confirmPassword) {
            this.userService.registerUser(newUser).subscribe(
                (response) => {
                    if (response)
                        this.message = `${this.languageService.getMessage('username')} ${response.userName} ${this.languageService.getMessage('created')} ✅`;
                    setTimeout(() => {
                        this.message = '';
                        this.showLoginUser();
                    }, 3000);
                },
                (error) => {
                    this.message = `${this.languageService.getMessage('errorCreatingUser')} 🚫`;
                    setTimeout(() => {
                        this.message = '';
                    },3000);
                }
            );
        } else {
            this.message = `${this.languageService.getMessage('passwordsDoNotMatch')} ❌`;
            setTimeout(() => {
                this.message = '';
                this.registerPassword = '';
                this.confirmPassword = '';
            }, 3000);
        }
    }

    loginUser() {
       this.userService.loginUser(this.loginUserName, this.loginPassword).subscribe(
            (response: any) => {
                if (response.message === 'Login successful') {
                    this.message = `${this.languageService.getMessage('loginSuccessful')} ✅`;
                    setTimeout(() => {
                        this.userService.setCurrentUser(response.user);
                        this.router.navigate(['/dashboard']);
                    },3000);
                } else {
                    this.message = `${this.languageService.getMessage('invalidCredentials')} 🚫`;
                    setTimeout(() =>{
                        this.message = '';
                    }, 3000);
                }
            });
    }

    showRegisterUser() {
        this.isLoginUserShown = false;
        this.isRegisterUserShown = true;
    }

    showLoginUser() {
        this.isLoginUserShown = true;
        this.isRegisterUserShown = false;
    }

    onToDashboard() {
        this.router.navigate(['/dashboard']);
    }
}
