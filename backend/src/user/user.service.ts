import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    // Create a new user with a hashed password
    async createUser(userName: string, password: string, isAdmin: boolean): Promise<User> {
        const user = this.userRepository.create({ userName, password, isAdmin });
        return this.userRepository.save(user);
    }

    // Validate a user's password during login
    async validateUser(userName: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { userName } });
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }

    // Get all users
    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    // Get a user by ID
    async findOne(id: number): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { id } });
    }

    // Update a user
    async updateUser(id: number, userName: string, isAdmin: boolean): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (user) {
            user.userName = userName;
            user.isAdmin = isAdmin;
            return this.userRepository.save(user);
        }
        throw new Error('User not found');
    }

    // Delete a user
    async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}
