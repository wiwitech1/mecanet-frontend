import { Routes } from '@angular/router';
const PageNotFoundComponent = () => import('./public/pages/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent);
const ComponentsDemoComponent = () => import('./shared/views/components-demo/components-demo.component').then(m => m.ComponentsDemoComponent);

export const routes: Routes = [
    { path: '',                 redirectTo:     '/components-demo', pathMatch: 'full' },
    { path: 'components-demo',  loadComponent:  ComponentsDemoComponent },
    { path: '**',               loadComponent:  PageNotFoundComponent },
];

