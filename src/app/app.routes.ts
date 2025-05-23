import { Routes } from '@angular/router';
import { ProductionLineViewComponent } from './features/asset-management/views/production-line-view/production-line-view.component';
import { PlantViewComponent } from './features/asset-management/views/plant-view/plant-view.component';
const PageNotFoundComponent = () => import('./public/pages/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent);
const ComponentsDemoComponent = (): Promise<any> => import('./shared/views/components-demo/components-demo.component').then(m => m.ComponentsDemoComponent);
const NewsViewComponent = (): Promise<any> => import('./features/news/views/news-view/news-view.component').then(m => m.NewsViewComponent);

const MachineryAssetViewComponent = (): Promise<any> => import('./features/asset-management/views/machinery-asset-view/machinery-asset-view.component').then(m => m.MachineryAssetViewComponent);
const MaintancePlanComponent = (): Promise<any> => import('./features/maintance-plan/views/maintance-plan.component').then(m => m.MaintancePlanComponent);


export const routes: Routes = [
    { path: 'components-demo',  loadComponent: ComponentsDemoComponent },
    { path: 'news',            loadComponent: NewsViewComponent },
    { path: '',                redirectTo: '/components-demo', pathMatch: 'full' },
    { path: 'activos/plantas',   component: PlantViewComponent },
    { path: 'activos/lineas-produccion',   component: ProductionLineViewComponent },
    { path: 'activos/maquinarias',   loadComponent: MachineryAssetViewComponent },
    { 
        path: 'plan-mantenimiento',
        children: [
            { path: '', loadComponent: MaintancePlanComponent },
        ]
    },
    { path: '**',              loadComponent: PageNotFoundComponent }
];

