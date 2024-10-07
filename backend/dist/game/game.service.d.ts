import { Repository } from 'typeorm';
import { Game } from './game.entity';
export declare class GameService {
    private gameRepository;
    constructor(gameRepository: Repository<Game>);
    createGame(userName: string): Promise<Game>;
    checkGuess(gameId: number, guess: number): Promise<{
        correct: boolean;
        close: boolean;
        lower: boolean;
        higher: boolean;
        attempts: number;
    }>;
    removeUnfinishedGames(): Promise<void>;
    findAll(isGuessed: boolean): Promise<Game[]>;
    countGames(isGuessed: boolean): Promise<number>;
    removeAllGames(): Promise<void>;
    getStatistics(): Promise<{
        averageOfGuesses: number;
        totalGames: number;
    }>;
    getUserStatistics(user: string): Promise<{
        averageOfGuesses: number;
        totalGames: number;
    }>;
    getGamesByUser(user: string): Promise<Game[]>;
    removeOneGame(gameId: number): Promise<void>;
}
