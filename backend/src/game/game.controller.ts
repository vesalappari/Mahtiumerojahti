import { Controller, Post, Param, Body, Get, Delete } from '@nestjs/common';
import { GameService } from './game.service';

class StartGameDto {
  userName: string;
}

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('start')
  async startGame(@Body() body: StartGameDto) {
    const game = await this.gameService.createGame(body.userName);
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

  @Delete(':id')
  async removeOneGame(@Param('id') gameId:number): Promise<{ message:string }>
  {
    try {
      await this.gameService.removeOneGame(gameId);
      return { message: "Game deleted successfully" };

    } catch(error) {
      throw new Error ("Failed to delete the game" + error.message);
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
