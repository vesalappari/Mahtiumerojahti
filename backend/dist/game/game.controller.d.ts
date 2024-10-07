import { GameService } from './game.service';
declare class StartGameDto {
    userName: string;
}
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    startGame(body: StartGameDto): Promise<{
        gameId: number;
    }>;
    removeAllGames(): Promise<{
        message: string;
    }>;
    removeOneGame(gameId: number): Promise<{
        message: string;
    }>;
    guessNumber(gameId: number, guess: number): Promise<{
        correct: boolean;
        close: boolean;
        lower: boolean;
        higher: boolean;
        attempts: number;
    }>;
    getAllGames(): Promise<import("./game.entity").Game[]>;
    getTotalGamesCount(): Promise<number>;
    getStatistics(): Promise<{
        averageOfGuesses: number;
        totalGames: number;
    }>;
    getUserStatistics(userName: string): Promise<{
        averageOfGuesses: number;
        totalGames: number;
    }>;
    getAllGamesByUser(user: string): Promise<import("./game.entity").Game[]>;
}
export {};
