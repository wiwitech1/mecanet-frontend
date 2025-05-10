import { Routes } from '@angular/router';
import {PageNotFoundComponent} from "./public/pages/page-not-found/page-not-found.component";

export const routes: Routes = [
 { path: '',                 redirectTo: 'home', pathMatch: 'full' },
 { path: '**',               component: PageNotFoundComponent }
];

