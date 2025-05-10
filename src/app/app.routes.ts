import { Routes } from '@angular/router';
const PageNotFoundComponent = () => import('./public/pages/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent);

export const routes: Routes = [
    { path: '',                 redirectTo:     '/home', pathMatch: 'full' },
    { path: '**',               loadComponent:  PageNotFoundComponent },
];

