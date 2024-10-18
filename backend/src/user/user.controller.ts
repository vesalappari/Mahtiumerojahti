import {Controller, Get, Post, Put, Body, Param, Delete, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import {JwtService} from "@nestjs/jwt";
import {JwtAuthGuard} from "./jwt-auth.guard";

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
        ) {}

    @Post()
    async createUser(
        @Body('userName') userName: string,
        @Body('password') password: string,  // Accept password from request body
        @Body('isAdmin') isAdmin: boolean,
    ) {
        return this.userService.createUser(userName, password, isAdmin);
    }

    /*
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

     */

    @Post('login')
    async login(
        @Body('userName') userName: string,
        @Body('password') password: string,
    ) {
        const user = await this.userService.validateUser(userName, password);
        if (user) {
            const payload = { username: user.userName, sub: user.id };
            const token = this.jwtService.sign(payload);

            return {
                message: 'Login successful',
                token,  // JWT token
                user: {  // User information to be sent to the frontend
                    id: user.id,
                    userName: user.userName,
                    isAdmin: user.isAdmin,
                },
            };
        } else {
            return { message: 'Invalid credentials' };
        }
    }

    /*

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

     */
    @Post('change-password')
    async changePassword(
        @Body('userName') userName: string,
        @Body('password') password: string,
        @Body('newPassword') newPassword: string,
    ) {
        const user = await this.userService.validateUser(userName, password);
        if (user) {
            const updatedUser = await this.userService.updateUserPassword(user.id, newPassword);
            return { message: 'Password change successful', user: updatedUser };
        } else {
            return { message: 'Invalid credentials' };
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('all-users')
    async findAll() {
        return this.userService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.userService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateUser(
        @Param('id') id: number,
        @Body('userName') userName: string,
        @Body('isAdmin') isAdmin: boolean,
    ) {
        return this.userService.updateUser(id, userName, isAdmin);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteUser(@Param('id') id: number) {
        return this.userService.deleteUser(id);
    }
}
