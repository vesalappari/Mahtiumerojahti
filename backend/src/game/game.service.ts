import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  async createGame(userName:string): Promise<Game> {
    await this.removeUnfinishedGames(userName);
    const game = this.gameRepository.create({
      secretNumber: Math.floor(Math.random() * 100) + 1,
      attempts: 0,
      userName,
    });
    return this.gameRepository.save(game);
  }

  async checkGuess(
    gameId: number,
    guess: number,
  ): Promise<{
    correct: boolean;
    close: boolean;
    lower: boolean;
    higher: boolean;
    attempts: number;
  }> {
    const game = await this.gameRepository.findOneBy({ id: gameId });

    if (!game || game.isGuessed) {
      return {
        correct: false,
        close: false,
        lower: false,
        higher: false,
        attempts: game?.attempts ?? 0,
      };
    }

    game.attempts += 1;

    const correct = guess === game.secretNumber;

    const close = Math.abs(game.secretNumber - guess) <= 5;
    const lower = guess < game.secretNumber;
    const higher = guess > game.secretNumber;

    if (correct) {
      game.isGuessed = true;
    }

    await this.gameRepository.save(game);

    return { correct, close, lower, higher, attempts: game.attempts };
  }

  async removeUnfinishedGames(name: string): Promise<void> {
    await this.gameRepository.delete({ isGuessed: false, userName: name });
  }

  findAll(isGuessed: boolean) {
    return this.gameRepository.find({
      where: { isGuessed },
      order: {
        id: 'DESC'
      }
    });
  }

  countGames(isGuessed: boolean): Promise<number> {
    return this.gameRepository.count({
      where: { isGuessed },
    });
  }

  async removeAllGames(): Promise<void> {
    try {
      await this.gameRepository.clear();
    } catch (error) {
      throw new Error('Failed to remove all games');
    }
  }

  async getStatistics(): Promise<{ averageOfGuesses: number; totalGames: number}> {
    const games = await this.gameRepository.find({where: {isGuessed: true}});
    const totalGames = games.length;
    const totalGuesses = games.reduce((acc, game) => acc + game.attempts, 0);
    const averageOfGuesses = totalGames > 0 ? Math.round(totalGuesses / totalGames) : 0;

    return { averageOfGuesses, totalGames};

  }

  async getUserStatistics(user: string): Promise<{ averageOfGuesses: number; totalGames: number }> {
    const games = await this.gameRepository.find({ where: { userName: user, isGuessed: true } });
    const totalGames = games.length;
    const totalGuesses = games.reduce((acc, game) => acc + game.attempts, 0);
    const averageOfGuesses = totalGames > 0 ? Math.round(totalGuesses / totalGames) : 0;

    return { averageOfGuesses, totalGames };
  }

  async getGamesByUser(user: string): Promise<Game[]> {
    return this.gameRepository.find({ where: {userName: user, isGuessed: true}});
  }

  async removeOneGame(gameId: number): Promise<void> {
    try {
      const result = await this.gameRepository.delete(gameId);
      if (!result.affected) {
        throw new Error('No game found with this ID');
      }
    } catch (error) {
      if (error.name === 'QueryFailedError') {
        throw new Error('Database query failed while trying to delete the game: ' + error.message);
      } else if (error.name === 'NotFoundError') {
        throw new Error('No game found with this ID: ' + error.message);
      } else {
        throw new Error('An error occurred while trying to delete the game: ' + error.message);
      }
    }
  }
}
