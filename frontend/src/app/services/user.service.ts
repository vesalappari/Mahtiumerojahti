import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
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

    registerUser(user: User): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}`, user);
    }

    loginUser(userName: string, password: string): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/login`, { userName, password });
    }

    getCurrentUser(): Observable<any> {
        return this.currentUser.asObservable();
    }

    setCurrentUser(resp:any) {
      this.currentUser.next(resp);
    }

    changePassword(userName: string, password: string, newPassword: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/change-password`,
            {userName: userName,
                password: password,
                newPassword: newPassword});
    }

    getUsers() {
        return this.http.get(`${this.apiUrl}/all-users`);
    }

    updateUser(id: number, userName: string, isAdmin: boolean): Observable<any> {
        const params = new HttpParams()
            .set('id', id)
            .set('userName', userName)
            .set('isAdmin', isAdmin.toString());
        return this.http.put(`${this.apiUrl}/${id}`, params);
    }

    isAdmin() {
        const user = this.currentUser.getValue();
        return user ? user.isAdmin : false;
    }
}
