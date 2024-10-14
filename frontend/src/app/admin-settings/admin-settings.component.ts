import {Component, Input, OnInit} from '@angular/core';
import {User} from "../models/user.model";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.css'
})
export class AdminSettingsComponent implements OnInit{
  @Input() currentUser: User | null = null;
  users: User[] = [];

  constructor(
      protected userService: UserService,
  ) {}

  async ngOnInit() {
    await this.loadUsers();
  }

    loadUsers() {
        if (this.userService.isAdmin()) {
            this.userService.getUsers().subscribe((data: any) => {
                this.users = data;
            });
        } else {
            alert('Unauthorized access. Only admins can load user data.');
        }
    }

  updateUserAdminStatus(user: User) {
    this.userService.updateUser(<number>user.id, <string>user.userName, <boolean>user.isAdmin)
        .subscribe(
            response => {
              console.log('User update response:', response);
            },
            error => {
              console.error('There was an error!', error);
            }
        );
  }
}
