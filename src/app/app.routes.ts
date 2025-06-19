import { Routes } from '@angular/router';
import { ProductionLineViewComponent } from './features/asset-management/views/production-line-view/production-line-view.component';
import { PlantViewComponent } from './features/asset-management/views/plant-view/plant-view.component';
import { HomeComponent } from './public/pages/home/home.component';
import { RegisterViewComponent } from './features/security/views/register-view/register-view.component';
import { authGuard } from './core/guards/auth.guard';
import { nonAuthGuard } from './core/guards/non-auth.guard';
import { PageNotFoundComponent } from './public/pages/page-not-found/page-not-found.component';
import { LoginViewComponent } from './features/security/views/login-view/login-view.component';
import { ComponentsDemoComponent } from './shared/views/components-demo/components-demo.component';
//const NewsViewComponent = (): Promise<any> => import('./features/news/views/news-view/news-view.component').then(m => m.NewsViewComponent);


const MachineryAssetViewComponent = (): Promise<any> => import('./features/asset-management/views/machinery-asset-view/machinery-asset-view.component').then(m => m.MachineryAssetViewComponent);

const MaintancePlanComponent = (): Promise<any> => import('./features/maintance-plan/views/maintance-plan.component').then(m => m.MaintancePlanComponent);
const MaintenancePlanDetailComponent = (): Promise<any> => import('./features/maintance-plan/components/maintenance-plan-detail/maintenance-plan-detail.component').then(m => m.MaintenancePlanDetailComponent);
const MaintenancePlanCreateComponent = (): Promise<any> => import('./features/maintance-plan/components/maintenance-plan-create/maintenance-plan-create.component').then(m => m.MaintenancePlanCreateComponent);
const MaintenancePlanCreateSelectComponent = (): Promise<any> => import('./features/maintance-plan/components/maintenance-plan-create-select/maintenance-plan-create-select.component').then(m => m.MaintenancePlanCreateSelectComponent);
const MaintenancePlanCreateDynamicComponent = (): Promise<any> => import('./features/maintance-plan/components/maintenance-plan-create-dynamic/maintenance-plan-create-dynamic.component').then(m => m.MaintenancePlanCreateDynamicComponent);

//const PropruebaComponent = (): Promise<any> => import('./features/shared/production-lines/proprueba/proprueba.component').then(m => m.PropruebaComponent);
const InventoryPartsViewComponent = (): Promise<any> => import('./features/inventory-parts/views/inventory-parts/inventory-parts.component').then(m => m.InventoryPartsComponent);
const PurchaseOrdersViewComponent = (): Promise<any> => import('./features/purchase-orders/view/purchase-orders/purchase-orders.component').then(m => m.PurchaseOrdersComponent);

const MaintenanceCalendarComponent = (): Promise<any> => import('./features/maintenance-calendar/view/maintenance-calendar/maintenance-calendar.component').then(m => m.MaintenanceCalendarComponent);
const WorkOrderComponent = (): Promise<any> => import('./features/work-order/views/work-order/work-order.component').then(m => m.WorkOrderComponent);
const ExecutionViewComponent = (): Promise<any> => import('./features/execution/views/execution-view/execution-view.component').then(m => m.ExecutionViewComponent);
export const routes: Routes = [
    // Rutas públicas o de autenticación - solo accesibles si NO hay sesión
    { path: 'iniciar-sesion', component: LoginViewComponent, canActivate: [nonAuthGuard] },
    { path: 'registrar', component: RegisterViewComponent, canActivate: [nonAuthGuard] },
    { path: '404', component: PageNotFoundComponent },

    // Rutas protegidas - solo accesibles si hay sesión
    { path: '', component: HomeComponent, canActivate: [authGuard] },
    { path: 'components-demo', component: ComponentsDemoComponent, canActivate: [authGuard] },
    { path: 'activos/plantas', component: PlantViewComponent, canActivate: [authGuard] },
    { path: 'activos/lineas-produccion', component: ProductionLineViewComponent, canActivate: [authGuard] },
    { path: 'activos/maquinarias', loadComponent: MachineryAssetViewComponent, canActivate: [authGuard] },
    {
        path: 'plan-mantenimiento',
        canActivate: [authGuard],
        children: [
            { path: '', loadComponent: MaintancePlanComponent },
            { path: 'detalle/:id', loadComponent: MaintenancePlanDetailComponent },
            { path: 'crear', loadComponent: MaintenancePlanCreateSelectComponent },
            { path: 'crear-estatico', loadComponent: MaintenancePlanCreateComponent },
            { path: 'crear-dinamico', loadComponent: MaintenancePlanCreateDynamicComponent },
            { path: 'editar/:id', loadComponent: MaintenancePlanCreateComponent },
        ]
    },
    {
        path: 'calendario',
        canActivate: [authGuard],
        children: [
            { path: '', loadComponent: MaintenanceCalendarComponent },
        ]
    },
    //{ path: 'proprueba', loadComponent: PropruebaComponent, canActivate: [authGuard] },
    { path: 'inventario/repuestos', loadComponent: InventoryPartsViewComponent, canActivate: [authGuard] },
    { path: 'inventario/ordenes-compra', loadComponent: PurchaseOrdersViewComponent, canActivate: [authGuard] },
    { path: 'ordenes-trabajo', loadComponent: WorkOrderComponent, canActivate: [authGuard] },
    { path: 'ejecucion', loadComponent: ExecutionViewComponent, canActivate: [authGuard] },
    // Ruta de redirección por defecto
    { path: '', redirectTo: '/components-demo', pathMatch: 'full' },


    // Página no encontrada
    { path: '**', redirectTo: '/404' }
];
