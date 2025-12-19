// ANGULAR
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// COMPONENTS
import {LayoutComponent} from './core/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '', redirectTo: 'character', pathMatch: 'full'
      },
      {
        path: 'character',
        loadChildren: () => import('./pages/character/character.module').then(m => m.CharacterModule)
      },
      {
        path: 'character-details/:id',
        loadChildren: () => import('./pages/character-details/character-details.module').then(m => m.CharacterDetailsModule)
      },
      {
        path: 'episode-details/:id',
        loadChildren: () => import('./pages/episode-details/episode-details.module').then(m => m.EpisodeDetailsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
