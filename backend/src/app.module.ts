import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from './game/game.module';
import { Game } from './game/game.entity';
import {UserModule} from "./user/user.module";
import {User} from "./user/user.entity";
import {AdminSeederService} from './seeder/seeder.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Database type
      host: 'localhost', // Postgres is hosted on localhost
      port: 5432, // Default Postgres port
      username: 'postgres', // Postgres username
      password: 'password', // Postgres password, adjust it to your actual DB password
      database: 'guessing_game', // Name of your database
      entities: [Game, User], // Entities to be used in your database
      synchronize: true, // Automatically syncs the database schema; disable in production
    }),
    GameModule,
      UserModule
  ],
  controllers: [AppController],
  providers: [AppService, AdminSeederService],
})
export class AppModule {}
