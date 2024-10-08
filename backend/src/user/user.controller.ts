import {Controller, Get, Post, Put, Body, Param, Delete} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(
        @Body('userName') userName: string,
        @Body('password') password: string,  // Accept password from request body
        @Body('isAdmin') isAdmin: boolean,
    ) {
        return this.userService.createUser(userName, password, isAdmin);
    }

    @Post('login')
    async login(
        @Body('userName') userName: string,
        @Body('password') password: string
    ) {
        const user = await this.userService.validateUser(userName, password);
        if (user) {
            return { message: 'Login successful', user };
        } else {
            return { message: 'Invalid credentials' };
        }
    }

    @Post('change-password')
    async changePassword(
        @Body('userName') userName: string,
        @Body('password') password: string,
        @Body('newPassword') newPassword: string,
    ) {
        const user = await this.userService.validateUser(userName, password);
        if (user) {
            const updatedUser = await this.userService.updateUserPassword(user.id, newPassword);
            return { message: 'success', user: updatedUser };
        } else {
            return { message: 'failed' };
        }
    }

    @Get('all-users')
    async findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.userService.findOne(id);
    }

    @Put(':id')
    async updateUser(
        @Param('id') id: number,
        @Body('userName') userName: string,
        @Body('isAdmin') isAdmin: boolean,
    ) {
        return this.userService.updateUser(id, userName, isAdmin);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: number) {
        return this.userService.deleteUser(id);
    }
}
