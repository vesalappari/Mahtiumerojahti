import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserService} from "../user/user.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSeederService implements OnModuleInit {
    constructor(private readonly userService: UserService) {}

    async onModuleInit() {
        await this.createAdminUser();
    }

    async createAdminUser() {
        const adminUser = await this.userService.findByUserName('admin');

        if (!adminUser) {
            await this.userService.createUser('admin', 'admin', true);
            console.log('Admin user created with username: admin and password: admin');
        } else {
            console.log('Admin user already exists');
        }
    }
}
