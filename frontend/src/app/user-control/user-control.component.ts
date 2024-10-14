import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../models/user.model";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {LanguageService} from "../services/language.service";

@Component({
  selector: 'app-user-control',
  templateUrl: './user-control.component.html',
  styleUrl: './user-control.component.css'
})


export class UserControlComponent implements OnInit{
  currentUser: User | null = null;
  showLogout: boolean = false;
  showChangePassword: boolean = false;
  @Input() showUserModal: boolean | undefined;
  @Output() showUserModalChange = new EventEmitter<boolean>(false);

  password: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  currentPassword: string = '';
  message: string = '';
  showAdminSettings: boolean = false;

  constructor(
      protected languageService: LanguageService,
      protected userService: UserService,
      private router: Router,
  ) {}

  ngOnInit() {
    this.userService.currentUser.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  closeUserModal() {
    this.showUserModal = false;
    this.closeLogout();
    this.showUserModalChange.emit(this.showUserModal);
  }


  logoutUser() {
    this.userService.setCurrentUser(null);
    this.closeUserModal();
    this.router.navigate(['/login']);
  }

  openLogout() {
    this.showLogout = true;
  }

  closeLogout() {
    this.showLogout = false;
  }

  openChangePassword() {
    this.showChangePassword = true;
  }

  closeChangePassword() {
    this.showChangePassword = false;
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Passwords do not match';
      setTimeout(() => {
        this.message = '';
      },3000);
    } else {
      if (this.currentUser?.userName) {
        const userName = this.currentUser.userName;
        this.userService.changePassword(userName, this.currentPassword, this.newPassword).subscribe(resp => {
          console.log('Message: ',resp.message)
          if (resp.message === 'success') {
            this.message = 'Password changed ✅';
            setTimeout(() => {
              this.resetPasswords();
              this.showChangePassword = false;
            },3000);
          } else if (resp.message === 'failed') {
            this.message = 'Failed to change password 🚫'
            setTimeout(() => {
              this.resetPasswords();
            },3000);
          } else {
            this.message = 'An error occurred 🚫';
            setTimeout(() => {
              this.resetPasswords();
            }, 3000);
          }
        }, error => {
          alert(error);
        });
      }
    }
  }

  resetPasswords() {
    this.password = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.message = '';
  }

  openAdminSettings() {
    this.showAdminSettings = true;
  }

  closeAdminSettings() {
    this.showAdminSettings = false;
  }
}
