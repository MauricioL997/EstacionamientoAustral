import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { EstadoCocherasComponent } from './pages/estado-cocheras/estado-cocheras.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { RegisterComponent } from './pages/register/register.component';
import { PreciosComponent } from './pages/precios/precios.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { DashboardContainerComponent } from './pages/dashboard-container/dashboard-container.component';
import {soloLogueadoGuard} from './guards/solo-logeado.guard';
import { soloAdminGuard } from './guards/solo-admin.guard';
import { soloPublicoGuard } from './guards/solo-publico.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [soloPublicoGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [soloPublicoGuard]
    },
    {
        path: '',
        component: DashboardContainerComponent,
        canActivate: [soloLogueadoGuard],
        children: [
            {
                path: 'EstadoCochera',
                component: EstadoCocherasComponent
            },
            {
                path: 'reporte',
                component: ReporteComponent,
                canActivate: [soloAdminGuard]
            },
            {
                path: 'precios',
                component: PreciosComponent
            },
        ]
    },
    {
        path: 'notfound',
        component: NotfoundComponent
    },
    {
        path: '**',
        redirectTo: 'notfound',
        pathMatch: 'full'
    },
];
