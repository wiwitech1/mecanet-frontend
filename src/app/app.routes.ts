import { Routes } from '@angular/router';
import { ProductionLineViewComponent } from './features/asset-management/views/production-line-view/production-line-view.component';
import { PlantViewComponent } from './features/asset-management/views/plant-view/plant-view.component';
const PageNotFoundComponent = () => import('./public/pages/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent);
const ComponentsDemoComponent = (): Promise<any> => import('./shared/views/components-demo/components-demo.component').then(m => m.ComponentsDemoComponent);
const NewsViewComponent = (): Promise<any> => import('./features/news/views/news-view/news-view.component').then(m => m.NewsViewComponent);

const MachineryAssetViewComponent = (): Promise<any> => import('./features/asset-management/views/machinery-asset-view/machinery-asset-view.component').then(m => m.MachineryAssetViewComponent);
const MaintancePlanComponent = (): Promise<any> => import('./features/maintance-plan/views/maintance-plan.component').then(m => m.MaintancePlanComponent);
const MaintenancePlanDetailComponent = (): Promise<any> => import('./features/maintance-plan/components/maintenance-plan-detail/maintenance-plan-detail.component').then(m => m.MaintenancePlanDetailComponent);
const MaintenancePlanCreateComponent = (): Promise<any> => import('./features/maintance-plan/components/maintenance-plan-create/maintenance-plan-create.component').then(m => m.MaintenancePlanCreateComponent);
const MaintenancePlanCreateSelectComponent = (): Promise<any> => import('./features/maintance-plan/components/maintenance-plan-create-select/maintenance-plan-create-select.component').then(m => m.MaintenancePlanCreateSelectComponent);
const MaintenancePlanCreateDynamicComponent = (): Promise<any> => import('./features/maintance-plan/components/maintenance-plan-create-dynamic/maintenance-plan-create-dynamic.component').then(m => m.MaintenancePlanCreateDynamicComponent);
const PropruebaComponent = (): Promise<any> => import('./features/shared/production-lines/proprueba/proprueba.component').then(m => m.PropruebaComponent);
const InventoryPartsViewComponent = (): Promise<any> => import('./features/inventory-parts/views/inventory-parts/inventory-parts.component').then(m => m.InventoryPartsComponent);
const PurchaseOrdersViewComponent = (): Promise<any> => import('./features/purchase-orders/view/purchase-orders/purchase-orders.component').then(m => m.PurchaseOrdersComponent);

export const routes: Routes = [
    { path: 'components-demo',  loadComponent: ComponentsDemoComponent },
   // { path: 'news',            loadComponent: NewsViewComponent },
    { path: '',                redirectTo: '/components-demo', pathMatch: 'full' },
    { path: 'activos/plantas',   component: PlantViewComponent },
    { path: 'activos/lineas-produccion',   component: ProductionLineViewComponent },
    { path: 'activos/maquinarias',   loadComponent: MachineryAssetViewComponent },
    {
        path: 'plan-mantenimiento',
        children: [
            { path: '', loadComponent: MaintancePlanComponent },
            { path: 'detalle/:id', loadComponent: MaintenancePlanDetailComponent },
            { path: 'crear', loadComponent: MaintenancePlanCreateSelectComponent },
            { path: 'crear-estatico', loadComponent: MaintenancePlanCreateComponent },
            { path: 'crear-dinamico', loadComponent: MaintenancePlanCreateDynamicComponent },
            { path: 'editar/:id', loadComponent: MaintenancePlanCreateComponent },
        ]
    },
    { path: 'proprueba', loadComponent: PropruebaComponent },
    { path: '**',              loadComponent: PageNotFoundComponent },
    { path: 'inventario/repuestos',   loadComponent: InventoryPartsViewComponent },
    { path: 'ordenes-compra',   loadComponent: PurchaseOrdersViewComponent },
    { path: '**',              loadComponent: PageNotFoundComponent },

];

