import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GameComponent} from "./game/game/game.component";
import {UserAuthComponent} from "./user-auth/user-auth.component";
import {DasbboardComponent} from "./dasbboard/dasbboard.component";

const routes: Routes = [
  { path: 'login', component: UserAuthComponent },
  { path: 'game', component: GameComponent },
  { path: 'dashboard', component: DasbboardComponent},
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/dashboard' } // Wildcard for unknown routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
