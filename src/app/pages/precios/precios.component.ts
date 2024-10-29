import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { DataPreciosService } from '../../services/data-precios.service';
import { Precio } from '../../interfaces/precios';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-precios',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './precios.component.html',
  styleUrls: ['./precios.component.scss']
})
export class PreciosComponent {
  precios: Precio[] = [];
  preciosService = inject(DataPreciosService);

  constructor() {
    this.cargarPrecios();
  }

  async cargarPrecios(): Promise<void> {
    try {
      this.precios = await this.preciosService.getPrecios();
      console.log("Precios cargados en el frontend:", this.precios);
    } catch (error) {
      console.error('Error cargando los precios:', error);
    }
  }
  
  
  async editarPrecio(precio: Precio): Promise<void> {
    const { value: nuevoPrecio } = await Swal.fire({
      title: `Modificar precio para ${precio.descripcion}`,
      input: 'number',
      inputLabel: 'Nuevo Precio',
      inputValue: precio.valor,
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
      precio.valor = Number(nuevoPrecio);
      try {
        await this.preciosService.updatePrecio(precio);
        await this.cargarPrecios();
        Swal.fire(`Precio actualizado a ${nuevoPrecio} para ${precio.descripcion}`, '', 'success');
      } catch (error) {
        console.error('Error al actualizar el precio:', error);
      }
    }
  }

  async borrarPrecio(precio: Precio): Promise<void> {
    const resultado = await Swal.fire({
      title: `¿Estás seguro de que quieres borrar el precio para ${precio.descripcion}?`,
      showCancelButton: true,
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar',
      icon: 'warning',
      confirmButtonColor: '#dc3545'
    });

    if (resultado.isConfirmed) {
      try {
        await this.preciosService.deletePrecio(precio.id!);
        await this.cargarPrecios();
        Swal.fire('Eliminado', `El precio para ${precio.descripcion} ha sido eliminado`, 'success');
      } catch (error) {
        console.error('Error al borrar el precio:', error);
      }
    }
  }

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
            const nuevoPrecio: Precio = { descripcion: nuevoTiempo, valor: Number(costo) };
            try {
                await this.preciosService.createPrecio(nuevoPrecio);
                Swal.fire('Agregado', `Nuevo precio para ${nuevoTiempo} con costo ${costo}`, 'success');
                await this.cargarPrecios();
            } catch (error) {
                console.error('Error al crear el precio:', error);
            }
        }
    }
  }
}