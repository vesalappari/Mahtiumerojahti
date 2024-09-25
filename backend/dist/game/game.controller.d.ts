import { GameService } from './game.service';
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    startGame(): Promise<{
        gameId: number;
    }>;
    removeAllGames(): Promise<{
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
}
