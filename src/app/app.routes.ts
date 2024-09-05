import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { EstadoCocherasComponent } from './pages/estado-cocheras/estado-cocheras.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminCocheraComponent } from './pages/admin-cochera/admin-cochera.component';
import { NuevoEstacionamientoComponent } from './pages/nuevo-estacionamiento/nuevo-estacionamiento.component';
import { CerrarCocheraComponent } from './pages/cerrar-cochera/cerrar-cochera.component';
import { PreciosComponent } from './pages/precios/precios.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { EliminarCocheraComponent } from './pages/eliminar-cochera/eliminar-cochera.component';

export const routes: Routes = [
   
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "register",
        component: RegisterComponent
    },
    {
        path:"EstadoCochera",
        component:EstadoCocherasComponent
    },
    {
        path:"adminCochera",
        component:AdminCocheraComponent
    },
    {
        path:"nuevoestacionamiento",
        component:NuevoEstacionamientoComponent
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
        path:"reporte ",
        component:ReporteComponent
    },
    {
        path:"eliminarcochera",
        component:EliminarCocheraComponent
    },
    
    {
        path: '',
        redirectTo:"login",
        pathMatch:"full"
    },
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
