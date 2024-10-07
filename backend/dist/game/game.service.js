"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const game_entity_1 = require("./game.entity");
let GameService = class GameService {
    constructor(gameRepository) {
        this.gameRepository = gameRepository;
    }
    async createGame(userName) {
        await this.removeUnfinishedGames();
        const game = this.gameRepository.create({
            secretNumber: Math.floor(Math.random() * 100) + 1,
            attempts: 0,
            userName,
        });
        return this.gameRepository.save(game);
    }
    async checkGuess(gameId, guess) {
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
    async removeUnfinishedGames() {
        await this.gameRepository.delete({ isGuessed: false });
    }
    findAll(isGuessed) {
        return this.gameRepository.find({
            where: { isGuessed },
            order: {
                id: 'DESC'
            }
        });
    }
    countGames(isGuessed) {
        return this.gameRepository.count({
            where: { isGuessed },
        });
    }
    async removeAllGames() {
        try {
            await this.gameRepository.clear();
        }
        catch (error) {
            throw new Error('Failed to remove all games');
        }
    }
    async getStatistics() {
        const games = await this.gameRepository.find({ where: { isGuessed: true } });
        const totalGames = games.length;
        const totalGuesses = games.reduce((acc, game) => acc + game.attempts, 0);
        const averageOfGuesses = totalGames > 0 ? Math.round(totalGuesses / totalGames) : 0;
        return { averageOfGuesses, totalGames };
    }
    async getUserStatistics(user) {
        const games = await this.gameRepository.find({ where: { userName: user, isGuessed: true } });
        const totalGames = games.length;
        const totalGuesses = games.reduce((acc, game) => acc + game.attempts, 0);
        const averageOfGuesses = totalGames > 0 ? Math.round(totalGuesses / totalGames) : 0;
        return { averageOfGuesses, totalGames };
    }
    async getGamesByUser(user) {
        return this.gameRepository.find({ where: { userName: user, isGuessed: true } });
    }
    async removeOneGame(gameId) {
        try {
            const result = await this.gameRepository.delete(gameId);
            if (!result.affected) {
                throw new Error('No game found with this ID');
            }
        }
        catch (error) {
            if (error.name === 'QueryFailedError') {
                throw new Error('Database query failed while trying to delete the game: ' + error.message);
            }
            else if (error.name === 'NotFoundError') {
                throw new Error('No game found with this ID: ' + error.message);
            }
            else {
                throw new Error('An error occurred while trying to delete the game: ' + error.message);
            }
        }
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(game_entity_1.Game)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GameService);
//# sourceMappingURL=game.service.js.map