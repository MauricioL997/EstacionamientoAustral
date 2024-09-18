import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { EstadoCocherasComponent } from './pages/estado-cocheras/estado-cocheras.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { RegisterComponent } from './pages/register/register.component';
import { CerrarCocheraComponent } from './pages/cerrar-cochera/cerrar-cochera.component';
import { PreciosComponent } from './pages/precios/precios.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { EliminarCocheraComponent } from './pages/eliminar-cochera/eliminar-cochera.component';
import { DashboardContainerComponent } from './pages/dashboard-container/dashboard-container.component';
import { soloLogeadoGuard } from './guards/solo-logeado.guard';

export const routes: Routes = [
    {
        path: '',
        component: DashboardContainerComponent,
        canActivate: [soloLogeadoGuard],
        children:[
                {
                    path:"EstadoCochera",
                    component:EstadoCocherasComponent
                },
                {
                    path:"reporte",
                    component:ReporteComponent
                },
        ]

    },
   
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "register",
        component: RegisterComponent
    },

    {
        path:"cerrarcochera",
        component:CerrarCocheraComponent
    },
    {
        path:"precios",
        component:PreciosComponent
    },
    {
        path:"eliminarcochera",
        component:EliminarCocheraComponent
    },
    
//    {
//        path: '',
//        redirectTo:"login",
//        pathMatch:"full"
//    },
    {
        path: 'notfound',
        component: NotfoundComponent
    },
    {
        path: '**',
        redirectTo:"notfound",
        pathMatch:"full"
    },
];
