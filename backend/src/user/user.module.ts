import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: 'yourSecretKey',
            signOptions: {expiresIn: '30m'}
        }),
        PassportModule,
    ],
    providers: [UserService, JwtStrategy],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
