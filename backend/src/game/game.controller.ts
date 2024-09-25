import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('start')
  async startGame() {
    const game = await this.gameService.createGame();
    return { gameId: game.id };
  }

  @Post('clear-all')
  async removeAllGames(): Promise<{ message: string }> {
    try {
      await this.gameService.removeAllGames();
      return { message: 'succes' };
    } catch (error) {
      throw new Error('Failed to remove all games');
    }
  }

  @Post('guess/:gameId')
  async guessNumber(
    @Param('gameId') gameId: number,
    @Body('guess') guess: number,
  ) {
    const result = await this.gameService.checkGuess(gameId, guess);
    return {
      correct: result.correct,
      close: result.close,
      lower: result.lower,
      higher: result.higher,
      attempts: result.attempts,
    };
  }

  @Get()
  getAllGames() {
    return this.gameService.findAll(true);
  }

  @Get('count')
  async getTotalGamesCount(): Promise<number> {
    return this.gameService.countGames(true);
  }
}
