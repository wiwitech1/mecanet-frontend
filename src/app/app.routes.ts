import { Routes } from '@angular/router';
import { PlantsAssetViewComponent } from './features/asset-management/views/plants-asset-view/plants-asset-view.component';
const PageNotFoundComponent = () => import('./public/pages/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent);
const ComponentsDemoComponent = (): Promise<any> => import('./shared/views/components-demo/components-demo.component').then(m => m.ComponentsDemoComponent);
const NewsViewComponent = (): Promise<any> => import('./features/news/views/news-view/news-view.component').then(m => m.NewsViewComponent);
const ProductionLinesAssetViewComponent = (): Promise<any> => import('./features/asset-management/views/production-lines-asset-view/production-lines-asset-view.component').then(m => m.ProductionLinesAssetViewComponent);
const MachineryAssetViewComponent = (): Promise<any> => import('./features/asset-management/views/machinery-asset-view/machinery-asset-view.component').then(m => m.MachineryAssetViewComponent);


export const routes: Routes = [
    { path: 'components-demo',  loadComponent: ComponentsDemoComponent },
    { path: 'news',            loadComponent: NewsViewComponent },
    { path: '',                redirectTo: '/components-demo', pathMatch: 'full' },
    { path: 'activos/plantas',   component: PlantsAssetViewComponent },
    { path: 'activos/lineas-produccion',   loadComponent: ProductionLinesAssetViewComponent },
    { path: 'activos/maquinarias',   loadComponent: MachineryAssetViewComponent },
    { path: '**',              loadComponent: PageNotFoundComponent },

];

