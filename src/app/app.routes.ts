import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: MainLayoutComponent },
      { path: 'generate-report', component: MainLayoutComponent },
      { path: 'settings', component: MainLayoutComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];
