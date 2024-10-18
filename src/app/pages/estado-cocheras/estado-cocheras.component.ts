import { Component, Inject, inject, NgModule } from '@angular/core';
import { RouterLink, Router, RouterModule } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { DataCocherasService } from '../../services/data-cocheras.service'; // Importa el servicio
import { DataAuthService } from '../../services/data-auth.service';
import Swal from 'sweetalert2';
import { routes } from '../../app.routes';
import { DataTarifasService } from '../../services/data-tarifa.service';
import { Cochera } from '../../interfaces/cochera';

@Component({
  selector: 'app-estado-cocheras',
  standalone: true,
  imports: [RouterLink, NgClass, CommonModule],
  templateUrl: './estado-cocheras.component.html',
  styleUrl: './estado-cocheras.component.scss'
})
export class EstadoCocherasComponent {
  authService = inject(DataAuthService);
  dataCocherasService = inject(DataCocherasService);
  dataTarifasService = inject(DataTarifasService);
  router = inject(Router);
  titulo: string = "Parking App";
  isAdmin = true


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
    title: "¿Quieres guardar los cambios?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Guardar",
    denyButtonText: `No guardar`
  }).then(async (result) => {
    /* Lee más acerca de isConfirmed, isDenied a continuación */
    if (result.isConfirmed) {
      await this.borrarFila(cocheraId)
      Swal.fire("¡Guardado!", "", "success");
    } else if (result.isDenied) {
      Swal.fire("Los cambios no se han guardado", "", "info");
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
  cerrarEstacionamiento(cochera: Cochera) {
    const horario = cochera.estacionamiento?.horaIngreso;
    let fechaIngreso;
    let horasPasadas = 0; 
    let minutosPasados = 0; 
    let patente: string;
    let tarifaABuscar: string;
    let total;

    if (horario) {
        fechaIngreso = new Date(horario);

        if (fechaIngreso) {
            const fechaActual = new Date();
            const diferenciaEnMilisegundos = fechaActual.getTime() - fechaIngreso.getTime();
            horasPasadas = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60));
            minutosPasados = Math.floor((diferenciaEnMilisegundos % (1000 * 60 * 60)) / (1000 * 60));
        }

        patente = cochera.estacionamiento?.patente!;

        const totalMinutos = horasPasadas * 60 + minutosPasados;
        if (totalMinutos <= 30) {
            tarifaABuscar = "MEDIAHORA";
        } else if (totalMinutos <= 60) {
            tarifaABuscar = "PRIMERAHORA";
        } else {
            tarifaABuscar = "VALORHORA";
        }

        total = this.dataTarifasService.tarifas.find(t => t.id === tarifaABuscar)?.valor;
    }

    const horaFormateada = fechaIngreso ? fechaIngreso.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    Swal.fire({
        html: `
            <div style="text-align: left;">
                <h4>Horario de inicio: ${horaFormateada}</h4>
                <h4>Tiempo transcurrido: ${horasPasadas} horas y ${minutosPasados} minutos</h4>
                <hr style="border: 1px solid #ccc;">
                <h2 style="margin: 20px 0 10px; text-align: center;">Total a cobrar</h2>
                <div style="background-color: #28a745; color: white; font-size: 24px; padding: 10px; border-radius: 5px; text-align: center; margin: 0 auto; display: block; width: fit-content;">
                    $${total}
                </div>
                <div style="margin-top: 20px; text-align: center;">
                    <button id="cobrar" class="swal2-confirm swal2-styled" style="background-color: #007bff; padding: 10px 24px;">Cobrar</button>
                    <button id="volver" class="swal2-cancel swal2-styled" style="background-color: #aaa; padding: 10px 24px;">Volver</button>
                </div>
            </div>`,
        showConfirmButton: false,
        didOpen: () => {
            const cobrarButton = document.getElementById('cobrar');
            const volverButton = document.getElementById('volver');
            
            if (cobrarButton) {
                cobrarButton.addEventListener('click', async () => {
                    const idUsuarioEgreso = "ADMIN";
                    await this.dataCocherasService.cerrarEstacionamiento(patente, idUsuarioEgreso);
                    Swal.close();
                });
            }
            
            if (volverButton) {
                volverButton.addEventListener('click', () => {
                    Swal.close();
                });
            }
        }
    });
  }
}



