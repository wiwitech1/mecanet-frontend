import { Routes } from '@angular/router';
const PageNotFoundComponent = () => import('./public/pages/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent);
const ComponentsDemoComponent = (): Promise<any> => import('./shared/views/components-demo/components-demo.component').then(m => m.ComponentsDemoComponent);
const NewsViewComponent = (): Promise<any> => import('./features/news/views/news-view/news-view.component').then(m => m.NewsViewComponent);

export const routes: Routes = [
    { path: 'components-demo',  loadComponent: ComponentsDemoComponent },
    { path: 'news',            loadComponent: NewsViewComponent },
    { path: '',                redirectTo: '/components-demo', pathMatch: 'full' },
    { path: '**',              loadComponent: PageNotFoundComponent }
];

