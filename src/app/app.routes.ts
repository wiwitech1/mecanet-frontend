import { Routes } from '@angular/router';
const PageNotFoundComponent = () => import('./public/pages/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent);
const ComponentsDemoComponent = (): Promise<any> => import('./shared/views/components-demo/components-demo.component').then(m => m.ComponentsDemoComponent);
const WorkOrdersPageComponent = () => import('./features/work-orders/presentation/pages/work-orders-page/work-orders-page.component').then(m => m.WorkOrdersPageComponent);

export const routes: Routes = [
    { path: 'work-orders',      loadComponent:  WorkOrdersPageComponent },
    { path: 'components-demo',  loadComponent:  ComponentsDemoComponent },
    { path: '',                 redirectTo:     '/components-demo', pathMatch: 'full' },
    { path: '**',               loadComponent:  PageNotFoundComponent }
];

