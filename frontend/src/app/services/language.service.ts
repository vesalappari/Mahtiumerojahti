import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  currentLanguage = new BehaviorSubject<string>('fi')
  public messageKey: string = '';

  private messages: { [key: string]: any } = {
    fi: {
      guideMessage: 'Arvaa numero väliltä 1-100',
      guesses: 'Arvaukset',
      startGame: 'Aloita peli',
      newGame: 'Uusi peli',
      placeGuess: 'Anna arvauksesi',
      guess: 'Arvaa',
      correctGuess: 'Oikein! Arvasit oikean numeron {attempts} yrityksellä',
      closeGuess: ' Lähellä!',
      lowGuess: 'Liian pieni! Valitse suurempi numero.',
      highGuess: 'Liian suuri! Valitse pienempi numero.',
      inputPlaceholder: 'Numero 1-100',
      isGuessed: 'On jo arvattu, valitse toinen',
      gameOverMessage: 'Peli on loppunut, aloita uusi peli',
      stats: 'Tilastot',
      totalCountOfGames: 'Pelien kokonaismäärä',
      averageGuesses: 'Arvausten keskiarvo',
      close: 'Sulje',
      winMessage: 'Voitit!',
      falseGuess: 'Numeron tulee olla välillä 1-100',
      clearAll: 'Poista kaikki',
      confirm: 'Vahvista',
    },
    en: {
      guideMessage: 'Guess a number between 1-100',
      guesses: 'guesses',
      startGame: 'Start Game',
      newGame: 'New game',
      placeGuess: 'Make your guess',
      guess: 'Guess',
      correctGuess: 'Correct! You guessed it with {attempts} attempts',
      closeGuess: ' Close!',
      lowGuess: 'Too low! Try a higher number.',
      highGuess: 'Too high! Try a lower number.',
      inputPlaceholder: 'Number 1-100',
      isGuessed: 'Already guessed, choose another',
      gameOverMessage: 'Game ended, start a new game',
      stats: 'Statistics',
      totalCountOfGames: 'Total count of games',
      averageGuesses: 'Average of guesses',
      close: 'Close',
      winMessage: 'You win!',
      falseGuess: 'Number must be between 1-100',
      clearAll: 'Clear all',
      confirm: 'Confirm',
    }
  };

  constructor() { }


  setLanguage(language: string) {
    if (this.messages[language]) {
      this.currentLanguage.next(language);
    } else {
      console.warn(`Language ${language} not supported`);
    }
  }

  getMessage(key: string, params: any = {}): string {
    const message = this.messages[this.currentLanguage.getValue()][key] || key;

    return message.replace(/{(\w+)}/g, (match: string, p1: string) => params[p1] || match);
  }
}
