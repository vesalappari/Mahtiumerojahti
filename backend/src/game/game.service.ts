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

  async createGame(): Promise<Game> {
    await this.removeUnfinishedGames();
    const game = this.gameRepository.create({
      secretNumber: Math.floor(Math.random() * 100) + 1,
      attempts: 0,
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

    console.log('Secret number:', game.secretNumber);
    console.log('Guess:', guess);
    console.log('Difference:', Math.abs(game.secretNumber - guess));

    const close = Math.abs(game.secretNumber - guess) <= 5;
    const lower = guess < game.secretNumber;
    const higher = guess > game.secretNumber;

    console.log('Close:', close);

    if (correct) {
      game.isGuessed = true;
    }

    await this.gameRepository.save(game);

    return { correct, close, lower, higher, attempts: game.attempts };
  }

  async removeUnfinishedGames(): Promise<void> {
    await this.gameRepository.delete({ isGuessed: false });
  }

  findAll(isGuessed: boolean) {
    return this.gameRepository.find({
      where: { isGuessed },
    });
  }

  countGames(isGuessed: boolean): Promise<number> {
    return this.gameRepository.count({
      where: { isGuessed },
    });
  }
}
