import {Controller, Post, Param, Body, Get, Delete, UseGuards} from '@nestjs/common';
import { GameService } from './game.service';
import {JwtAuthGuard} from "../user/jwt-auth.guard";
import {AdminGuard} from "../user/admin.guard";

class StartGameDto {
  userName: string;
}

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @UseGuards(JwtAuthGuard)
  @Post('start')
  async startGame(@Body() body: StartGameDto) {
    const game = await this.gameService.createGame(body.userName);
    return { gameId: game.id };
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('clear-all')
  async removeAllGames(): Promise<{ message: string }> {
    try {
      await this.gameService.removeAllGames();
      return { message: 'success' };
    } catch (error) {
      throw new Error('Failed to remove all games');
    }
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('delete/:id')
  async removeOneGame(@Param('id') gameId:number): Promise<{ message:string }>
  {
    try {
      await this.gameService.removeOneGame(gameId);
      return { message: "success" };

    } catch(error) {
      throw new Error ("Failed to delete the game" + error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllGames() {
    return this.gameService.findAll(true);
  }

  @UseGuards(JwtAuthGuard)
  @Get('count')
  async getTotalGamesCount(): Promise<number> {
    return this.gameService.countGames(true);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats-general')
  async getStatistics() {
    return this.gameService.getStatistics();
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats-user/:userName')
  async getUserStatistics(@Param('userName') userName: string) {
    return this.gameService.getUserStatistics(userName);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-games/:userName')
  async getAllGamesByUser(@Param('userName') user: string) {
    return this.gameService.getGamesByUser(user);
  }
}
