import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from "../models/user.model";
import {jwtDecode} from "jwt-decode";
import {StorageService} from "./storage.service";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private apiUrl = 'http://192.168.1.108:3000/users';

    public currentUser: BehaviorSubject<User | null>;
    showUserAuth: boolean = true;

    constructor(
        private http: HttpClient,
        private router: Router,
        private storageService: StorageService
    ) {
        this.currentUser = new BehaviorSubject<User | null>(null);
    }

    registerUser(user: User): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}`, user);
    }

    loginUser(userName: string, password: string): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/login`, { userName, password });
    }

    isTokenExpired(token: string): boolean {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return decodedToken.exp < currentTime;
    }

    async isAuthenticated(): Promise<boolean> {
        const token = localStorage.getItem('authToken');
        if (token) {
            if (this.isTokenExpired(token)) {
                await this.logoutUser();
                await this.router.navigate(['/login']);
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    async logoutUser() {
        localStorage.removeItem('authToken');
        this.currentUser.next(null);
    }

    getCurrentUser(): Observable<any> {
        return this.currentUser.asObservable();
    }

    setCurrentUser(resp:any) {
        const user: User = resp.user;
        const token: string = resp.token;
        this.storageService.setItem('authToken', token);
        this.currentUser.next(user);
    }

    changePassword(userName: string, password: string, newPassword: string): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.post(`${this.apiUrl}/change-password`,
            {
                userName: userName,
                password: password,
                newPassword: newPassword
            }, { headers });
    }

    getUsers(): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.get(`${this.apiUrl}/all-users`, { headers });
    }

    updateUser(id: number, userName: string, isAdmin: boolean): Observable<any> {
        const headers = this.getAuthHeaders();
        const params = new HttpParams()
            .set('id', id)
            .set('userName', userName)
            .set('isAdmin', isAdmin.toString());

        return this.http.put(`${this.apiUrl}/${id}`, params, { headers });
    }

    deleteUser(user: User) {
        const headers = this.getAuthHeaders();
        return this.http.delete(`${this.apiUrl}/${user.id}`, { headers });
    }

    isAdmin() {
        const user = this.currentUser.getValue();
        return user ? user.isAdmin : false;
    }

    private getAuthHeaders(): HttpHeaders {
        const token = this.storageService.getItem('authToken');
        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
    }

    resetPassword(userId: number, newPassword: string) {
        const headers = this.getAuthHeaders();
        return this.http.post(`${this.apiUrl}/reset-password/${userId}`, {newPassword}, {headers});
    }
}
