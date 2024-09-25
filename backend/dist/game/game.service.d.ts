import { Repository } from 'typeorm';
import { Game } from './game.entity';
export declare class GameService {
    private gameRepository;
    constructor(gameRepository: Repository<Game>);
    createGame(): Promise<Game>;
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
}
