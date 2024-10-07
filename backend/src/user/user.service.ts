import {ConflictException, Injectable} from '@nestjs/common';
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

    async createUser(userName: string, password: string, isAdmin: boolean): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: { userName } });
        if (existingUser) {
            throw new ConflictException('Username already exists');
        } else {
            const user = this.userRepository.create({ userName, password, isAdmin });
            return this.userRepository.save(user);
        }
    }

    async validateUser(userName: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { userName } });
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: number): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { id } });
    }

    async updateUser(id: number, userName: string, isAdmin: boolean): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (user) {
            user.userName = userName;
            user.isAdmin = isAdmin;
            return this.userRepository.save(user);
        }
        throw new Error('User not found');
    }

    async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async updateUserPassword(userId: number, newPassword: string) {
        const user = await this.userRepository.findOne({where:{id: userId}});
        if (user) {
            user.password = newPassword;
            await user.hashPassword();
            return this.userRepository.save(user);
        }
    }
}
