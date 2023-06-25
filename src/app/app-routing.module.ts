import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tokens/tokens.component').then(m => m.TokensComponent)
  },
  {
    path: 'performance',
    loadComponent: () => import('./performance/performance.component').then(m => m.PerformanceComponent)
  },
  {
    path: 'galaktika',
    loadComponent: () => import('./galaktika/galaktika.component').then(m => m.GalaktikaComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
