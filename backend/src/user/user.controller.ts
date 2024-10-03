import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // Create user
    @Post()
    async createUser(
        @Body('userName') userName: string,
        @Body('password') password: string,  // Accept password from request body
        @Body('isAdmin') isAdmin: boolean,
    ) {
        return this.userService.createUser(userName, password, isAdmin);
    }

    // Endpoint to log in a user
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

    // Get all users
    @Get()
    async findAll() {
        return this.userService.findAll();
    }

    // Get a single user by ID
    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.userService.findOne(id);
    }

    // Update a user by ID
    @Put(':id')
    async updateUser(
        @Param('id') id: number,
        @Body('userName') userName: string,
        @Body('isAdmin') isAdmin: boolean,
    ) {
        return this.userService.updateUser(id, userName, isAdmin);
    }

    // Delete a user by ID
    @Delete(':id')
    async deleteUser(@Param('id') id: number) {
        return this.userService.deleteUser(id);
    }
}
