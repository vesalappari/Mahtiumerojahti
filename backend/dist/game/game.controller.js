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
exports.GameController = void 0;
const common_1 = require("@nestjs/common");
const game_service_1 = require("./game.service");
class StartGameDto {
}
let GameController = class GameController {
    constructor(gameService) {
        this.gameService = gameService;
    }
    async startGame(body) {
        const game = await this.gameService.createGame(body.userName);
        return { gameId: game.id };
    }
    async removeAllGames() {
        try {
            await this.gameService.removeAllGames();
            return { message: 'succes' };
        }
        catch (error) {
            throw new Error('Failed to remove all games');
        }
    }
    async removeOneGame(gameId) {
        try {
            await this.gameService.removeOneGame(gameId);
            return { message: "Game deleted successfully" };
        }
        catch (error) {
            throw new Error("Failed to delete the game" + error.message);
        }
    }
    async guessNumber(gameId, guess) {
        const result = await this.gameService.checkGuess(gameId, guess);
        return {
            correct: result.correct,
            close: result.close,
            lower: result.lower,
            higher: result.higher,
            attempts: result.attempts,
        };
    }
    getAllGames() {
        return this.gameService.findAll(true);
    }
    async getTotalGamesCount() {
        return this.gameService.countGames(true);
    }
};
exports.GameController = GameController;
__decorate([
    (0, common_1.Post)('start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [StartGameDto]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "startGame", null);
__decorate([
    (0, common_1.Post)('clear-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GameController.prototype, "removeAllGames", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "removeOneGame", null);
__decorate([
    (0, common_1.Post)('guess/:gameId'),
    __param(0, (0, common_1.Param)('gameId')),
    __param(1, (0, common_1.Body)('guess')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "guessNumber", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GameController.prototype, "getAllGames", null);
__decorate([
    (0, common_1.Get)('count'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getTotalGamesCount", null);
exports.GameController = GameController = __decorate([
    (0, common_1.Controller)('game'),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameController);
//# sourceMappingURL=game.controller.js.map