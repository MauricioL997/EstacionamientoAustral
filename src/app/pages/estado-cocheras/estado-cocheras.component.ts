import { Component, Inject, inject, NgModule } from '@angular/core';
import { RouterLink, Router, RouterModule } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { DataCocherasService } from '../../services/data-cocheras.service'; // Importa el servicio
import { DataAuthService } from '../../services/data-auth.service';
import Swal from 'sweetalert2';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-estado-cocheras',
  standalone: true,
  imports: [RouterLink, NgClass, CommonModule],
  templateUrl: './estado-cocheras.component.html',
  styleUrl: './estado-cocheras.component.scss'
})
export class EstadoCocherasComponent {
  authService = inject(DataAuthService);
  titulo: string = "Parking App";

  dataCocherasService = inject(DataCocherasService);
  isAdmin = true
  router: any;
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
async agregarCochera(){
  await this.dataCocherasService.agregarCochera()
}

async borrarFila(index:number){
  await this.dataCocherasService.borrarFila(index)
}

deshabilitarCochera(index:number){
  this.dataCocherasService.deshabilitarCochera(index)
}

habilitarCochera(index:number){
  this.dataCocherasService.habilitarCochera(index)
}

preguntarBorrarCochera(cocheraId: number){
  Swal.fire({
    title: "Do you want to save the changes?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Save",
    denyButtonText: `Don't save`
  }).then(async (result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      await this.borrarFila(cocheraId)
      Swal.fire("Saved!", "", "success");
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
}
confirmLogout(event: Event) {

  Swal.fire({
    title: '¿Estás seguro?',
    text: "¡No podrás revertir esta acción!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: '¡Cerrando sesión!',
        text: 'Has cerrado sesión exitosamente.',
        icon: 'success'
      }).then(() => {
        this.router.navigate(['/login']);
      });
    }
  });
}
abrirEstacionamiento(idCochera: number) {
  const idUsuarioIngreso = "ADMIN"
  Swal.fire({
    title: "Abrir Cochera",
    html: `<input type="text" id="patente" class="swal2-input" placeholder="Ingrese patente">`,
    showCancelButton: true,
    confirmButtonText: "Abrir",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const patenteInput = document.getElementById("patente") as HTMLInputElement
      if (!patenteInput || !patenteInput.value) {
        Swal.showValidationMessage("Por favor, ingrese una patente")
        return false;
      }
      return { patente: patenteInput.value };
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { patente } = result.value;
      await this.dataCocherasService.abrirEstacionamiento(patente, idUsuarioIngreso, idCochera);
    }
  })
}
cerrarEstacionamiento() {

}

}



