import { Component } from '@angular/core';
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";
import {GameService} from "../game.service";
import {LanguageService} from "../services/language.service";

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.css'
})
export class UserAuthComponent {

    registerUserName: string = '';
    registerPassword: string = '';
    isAdmin: boolean = false;
    isLoginUserShown: boolean = true;
    isRegisterUserShown: boolean = false;

    loginUserName: string = '';
    loginPassword: string = '';

    message: string = '';

    constructor(
        protected userService: UserService,
        protected gameService: GameService,
        protected languageService: LanguageService,
    ) {}

    registerUser() {
        const newUser: User = {
            userName: this.registerUserName,
            password: this.registerPassword,
            isAdmin: this.isAdmin,
        };

        this.userService.registerUser(newUser).subscribe(
            (response) => {
                this.message = `User ${response.userName} registered successfully!`;
            },
            (error) => {
                this.message = 'Error registering user';
            }
        );
    }

    async loginUser() {
        await this.userService.loginUser(this.loginUserName, this.loginPassword).subscribe(
            (response:any) => {
                console.log(response);
                this.userService.setCurrentUser(response.user);
                this.message = `${response.message}`;
                setTimeout(() => {
                    this.userService.showUserAuth = false;
                    this.gameService.showGame = true;
                },3000);
            },
            (error) => {
                this.message = 'Invalid credentials, try again.';
            }
        );
    }

    showRegisterUser() {
        this.isLoginUserShown = false;
        this.isRegisterUserShown = true;
    }

    showLoginUser() {
        this.isLoginUserShown = true;
        this.isRegisterUserShown = false;
    }
}
