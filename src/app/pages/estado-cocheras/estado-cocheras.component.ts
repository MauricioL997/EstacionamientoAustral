import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Cochera } from '../../interfaces/cochera';
import { CommonModule, NgClass } from '@angular/common';
import Swal from 'sweetalert2';
import { DataCocherasService } from '../../services/data-cocheras.service';
import { DataAuthService } from '../../services/data-auth.service';
import { DataTarifasService } from '../../services/data-tarifa.service';

@Component({
  selector: 'app-estado-cocheras',
  standalone: true,
  imports: [RouterLink, NgClass, CommonModule],
  templateUrl: './estado-cocheras.component.html',
  styleUrls: ['./estado-cocheras.component.scss']
})
export class EstadoCocherasComponent {
  authService = inject(DataAuthService);
  dataCocherasService = inject(DataCocherasService);
  dataTarifasService = inject(DataTarifasService);
  router = inject(Router);
  titulo: string = "Parking App";
  esAdmin = true;

  preguntarAgregarCochera() {
    Swal.fire({
      title: "Nueva cochera?",
      showCancelButton: true,
      confirmButtonText: "Agregar",
      denyButtonText: `Cancelar`,
      input: "text",
      inputLabel: "Nombre cochera"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.dataCocherasService.agregarCochera(result.value);
      }
    });
  }

  preguntarBorrarCochera(cocheraId: number) {
    Swal.fire({
      title: "Borrar cochera?",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.dataCocherasService.borrarFila(cocheraId);
        Swal.fire("Cochera eliminada con éxito", "", "success");
      }
    });
  }

  preguntarDeshabilitarCochera(cocheraId: number) {
    Swal.fire({
      title: "Deshabilitar cochera?",
      showCancelButton: true,
      confirmButtonText: "Deshabilitar",
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.dataCocherasService.deshabilitarCochera(cocheraId);
      }
    });
  }

  preguntarHabilitarCochera(cocheraId: number) {
    Swal.fire({
      title: "Habilitar cochera?",
      showCancelButton: true,
      confirmButtonText: "Habilitar",
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.dataCocherasService.habilitarCochera(cocheraId);
      }
    });
  }

  abrirEstacionamiento(idCochera: number) {
    const idUsuarioIngreso = "1";
    Swal.fire({
      title: "Abrir Cochera",
      html: `<input type="text" id="patente" class="swal2-input" placeholder="Ingrese patente">`,
      showCancelButton: true,
      confirmButtonText: "Abrir",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const patenteInput = document.getElementById("patente") as HTMLInputElement;
        if (!patenteInput || !patenteInput.value) {
          Swal.showValidationMessage("Por favor, ingrese una patente");
          return false;
        }
  
        const patenteExistente = this.dataCocherasService.cocheras.some(
          cochera => cochera.estacionamiento?.patente === patenteInput.value
        );
  
        if (patenteExistente) {
          Swal.showValidationMessage("La patente ya está en uso en otra cochera");
          return false;
        }
  
        return { patente: patenteInput.value };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { patente } = result.value;
        await this.dataCocherasService.abrirEstacionamiento(patente, idUsuarioIngreso, idCochera);
      }
    });
  }

  async cerrarEstacionamiento(cochera: Cochera) {
    const horario = cochera.estacionamiento?.horaIngreso;
    let fechaIngreso;
    let horasPasadas = 0; 
    let minutosPasados = 0; 
    let patente: string;
    let tarifaABuscar: string;
    let total = 0;
  
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
        tarifaABuscar = "MEDIA HORA";
      } else if (totalMinutos <= 60) {
        tarifaABuscar = "UNA HORA";
      } else {
        tarifaABuscar = "VALOR HORA";
      }
  
      const tarifa = this.dataTarifasService.tarifas.find(t => t.descripcion === tarifaABuscar);
      total = tarifa ? Number(tarifa.valor) : 0;
  
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
              const idUsuarioEgreso = "1";
              await this.dataCocherasService.cerrarEstacionamiento(patente, idUsuarioEgreso);
  
              // Usar el id del estacionamiento, no el id de la cochera
              const estacionamientoId = cochera.estacionamiento?.id;
              if (estacionamientoId) {
                await this.dataCocherasService.deleteEstacionamiento(estacionamientoId);
                Swal.fire("Estacionamiento eliminado con éxito", "", "success");
                Swal.close();
              } else {
                console.error("ID de estacionamiento no encontrado para eliminar.");
              }
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
  
}
