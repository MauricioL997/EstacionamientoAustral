import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { DataPreciosService } from '../../services/data-precios.service';
import { Precio } from '../../interfaces/precios';


@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  styleUrls: ['./precios.component.scss']
})
export class PreciosComponent {
  precios: Precio[] = []; // Usar la interfaz en lugar de `any[]`
  preciosService = inject(DataPreciosService);

  constructor() {
    this.cargarPrecios();
  }

  // Método para cargar precios desde el servicio
  async cargarPrecios(): Promise<void> {
    try {
      this.precios = await this.preciosService.getPrecios();
    } catch (error) {
      console.error('Error cargando los precios:', error);
    }
  }

  // Método para editar el precio
  async editarPrecio(precio: Precio): Promise<void> {
    const { value: nuevoPrecio } = await Swal.fire({
      title: `Modificar precio para ${precio.tiempo}`,
      input: 'number',
      inputLabel: 'Nuevo Precio',
      inputValue: precio.costo,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        const numValue = Number(value);
        if (isNaN(numValue) || numValue <= 0) {
          return 'Debe ingresar un valor mayor a 0';
        }
        return null;
      }
    });

    if (nuevoPrecio) {
      precio.costo = nuevoPrecio;
      try {
        await this.preciosService.updatePrecio(precio);
        Swal.fire(`Precio actualizado a ${nuevoPrecio} para ${precio.tiempo}`, '', 'success');
        this.cargarPrecios();
      } catch (error) {
        console.error('Error al actualizar el precio:', error);
      }
    }
  }

  // Método para borrar un precio
  async borrarPrecio(precio: Precio): Promise<void> {
    const resultado = await Swal.fire({
      title: `¿Estás seguro de que quieres borrar el precio para ${precio.tiempo}?`,
      showCancelButton: true,
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar',
      icon: 'warning',
      confirmButtonColor: '#dc3545'
    });

    if (resultado.isConfirmed) {
      try {
        await this.preciosService.deletePrecio(precio.id!);
        Swal.fire('Eliminado', `El precio para ${precio.tiempo} ha sido eliminado`, 'success');
        this.cargarPrecios();
      } catch (error) {
        console.error('Error al borrar el precio:', error);
      }
    }
  }

  // Método para agregar un nuevo precio
  async agregarPrecio(): Promise<void> {
    const { value: nuevoTiempo } = await Swal.fire({
      title: 'Agregar nuevo precio',
      input: 'text',
      inputLabel: 'Descripción del Tiempo (Ej: Media Hora, 1 Hora, etc.)',
      inputPlaceholder: 'Ingresa el tiempo',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar'
    });

    if (nuevoTiempo) {
      const { value: costo } = await Swal.fire({
        title: `Ingresar costo para ${nuevoTiempo}`,
        input: 'number',
        inputLabel: 'Costo',
        inputPlaceholder: 'Ingresa el costo',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          const numValue = Number(value);
          if (isNaN(numValue) || numValue <= 0) {
            return 'Debe ingresar un valor mayor a 0';
          }
          return null;
        }
      });

      if (costo) {
        const nuevoPrecio: Precio = { tiempo: nuevoTiempo, costo: costo }; // Usar la interfaz
        try {
          await this.preciosService.createPrecio(nuevoPrecio);
          Swal.fire('Agregado', `Nuevo precio para ${nuevoTiempo} con costo ${costo}`, 'success');
          this.cargarPrecios();
        } catch (error) {
          console.error('Error al crear el precio:', error);
        }
      }
    }
  }
}
