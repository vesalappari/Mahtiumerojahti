import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from './game/game.module';
import { Game } from './game/game.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Database type
      host: 'localhost', // Postgres is hosted on localhost
      port: 5432, // Default Postgres port
      username: 'postgres', // Postgres username
      password: 'password', // Postgres password, adjust it to your actual DB password
      database: 'guessing_game', // Name of your database
      entities: [Game], // Entities to be used in your database
      synchronize: true, // Automatically syncs the database schema; disable in production
    }),
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
