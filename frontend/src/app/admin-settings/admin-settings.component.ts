import {Component, Input, OnInit} from '@angular/core';
import {User} from "../models/user.model";
import {UserService} from "../services/user.service";
import {LanguageService} from "../services/language.service";
import {StateService} from "../services/state.service";

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.css'
})
export class AdminSettingsComponent implements OnInit{
  @Input() currentUser: User | null = null;
  users: User[] = [];

    protected activeUserConfirm: User | null = null;
    protected selectedUser: User | null = null;
    protected timeoutId: any;
    protected message: string = '';
    protected newPassword: string = '';
    protected currentPage: number = 1;
    protected itemsPerPage: number = 5;
    protected maxPage: number = 1;

  constructor(
      protected userService: UserService,
      protected languageService: LanguageService,
      protected stateService: StateService,
  ) {}

    ngOnInit() {
        this.stateService.startLoading();
        this.loadUsers();
    }

    loadUsers() {
        if (this.userService.isAdmin()) {
            this.userService.getUsers().subscribe(
                (data: any) => {
                    this.users = data;
                    this.maxPage = Math.ceil(data.length / this.itemsPerPage);
                    this.stateService.stopLoading();
                },
                (error) => {
                    this.stateService.stopLoading();
                    alert('Failed to load users');
                    if (error.status === 401) {
                        alert('Unauthorized');
                    }
                });
        } else {
            this.stateService.stopLoading();
            alert('Unauthorized access. Only admins can load user data.');
        }
    }

    getVisibleUsers() {
        return this.users.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
    }

    getVisiblePageNumbersForUsers() {
        let startPage: number;
        let endPage: number;

        if (this.maxPage <= 5) {
            startPage = 1;
            endPage = this.maxPage;
        } else {
            if (this.currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (this.currentPage + 2 >= this.maxPage) {
                startPage = this.maxPage - 4;
                endPage = this.maxPage;
            } else {
                startPage = this.currentPage - 2;
                endPage = this.currentPage + 2;
            }
        }

        let visiblePageNumbers = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);
        return visiblePageNumbers;
    }

  updateUserAdminStatus(user: User) {
    this.userService.updateUser(<number>user.id, <string>user.userName, <boolean>user.isAdmin)
        .subscribe(
            response => {
            },
            error => {
              console.error('There was an error!', error);
            }
        );
  }

  deleteUser(user: User) {
      this.activeUserConfirm = user;
      this.timeoutId = setTimeout(() => {
          this.activeUserConfirm = null;
          },3000);
  }

  confirmDelete(user: User) {
      clearTimeout(this.timeoutId);
      this.userService.deleteUser(user).subscribe(
          response => {
              console.log(response);
              this.activeUserConfirm = null;
              this.loadUsers();
              },
            error => {
                console.error('There was an error!', error);
          });
  }

    resetUserPassword(userId: number | undefined, newPassword: string) {
      if (userId){
          this.userService.resetPassword(userId, newPassword).subscribe(
              (response) => {
                  this.message = `Success ✅`;
                  setTimeout(() => {
                      this.message = '';
                      this.selectedUser = null;
                  }, 3000);
              },
              (error) => {
                  this.message = `Failed to reset password 🚫`;
                  setTimeout(() => {
                      this.message = '';
                      this.selectedUser = null;
                  }, 3000);
              }
          );
      } else {
          alert('No user selected')
      }
    }

    clearSelectedUser() {
      this.selectedUser = null;
    }
}
