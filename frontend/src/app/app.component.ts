import {Component, OnInit} from '@angular/core';
import {LanguageService} from "./services/language.service";
import {StatisticsService} from "./services/statistics.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Mahtinumerojahti';
  showStatisticsModal: boolean = false;

  constructor(
    protected languageService: LanguageService,
    protected statisticsService: StatisticsService,
  ) {}

  ngOnInit() {
    this.languageService.currentLanguage.subscribe(language => {
      this.title = this.languageService.getMessage(this.languageService.messageKey);
    });


  }

  changeLanguage(event: Event) {
    const selectedLanguage = (event.target as HTMLSelectElement).value;
    this.languageService.setLanguage(selectedLanguage);
  }

  openStatisticsModal() {
    this.showStatisticsModal = true;
  }

  closeStatisticsModal() {
    this.showStatisticsModal = false;
  }
}
