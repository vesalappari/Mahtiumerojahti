import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from "../models/user.model";

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private apiUrl = 'http://localhost:3000/users';

    public currentUser: BehaviorSubject<User | null>;
    showUserAuth: boolean = true;

    constructor(
        private http: HttpClient,
    ) {
        this.currentUser = new BehaviorSubject<User | null>(null);
    }

    // Register a new user
    registerUser(user: User): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}`, user);
    }

    // Log in a user
    loginUser(userName: string, password: string): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/login`, { userName, password });
    }

    // Get the current user
    getCurrentUser(): Observable<any> {
        return this.currentUser.asObservable();
    }

    setCurrentUser(resp:any) {
      this.currentUser.next(resp);
    }

    changePassword(userName: string, password: string, newPassword: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/change-password`,
            {userNAme: userName,
                password: password,
                newPassword: newPassword});
    }
}
