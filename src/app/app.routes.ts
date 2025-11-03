import { Routes } from '@angular/router';
import { CredorJourneyGame } from './credor-journey-game/credor-journey-game';
import { MainLayoutView } from './main-layout-view/main-layout-view';

export const routes: Routes = [
// Esta rota carrega a página inicial (Home)
  { path: '', component: MainLayoutView, title: 'Inicio' },

  // Esta rota carrega o jogo (e substitui a Home)
  { path: 'credor-journey-game', component: CredorJourneyGame, title: 'Jogo A Jornada do Credor'},
];
