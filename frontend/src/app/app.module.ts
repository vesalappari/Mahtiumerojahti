import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game/game.component';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { StatisticsComponent } from './statistics/statistics.component';
import { UserAuthComponent } from './user-auth/user-auth.component';
import { DasbboardComponent } from './dasbboard/dasbboard.component';
import { UserControlComponent } from './user-control/user-control.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    StatisticsComponent,
    UserAuthComponent,
    DasbboardComponent,
    UserControlComponent,
    AdminSettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
