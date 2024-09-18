import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Cocheras } from '../../interfaces/cochera';
import { CommonModule, NgClass } from '@angular/common';
import { DataCocherasService } from '../../services/data-cocheras.service'; // Importa el servicio

@Component({
  selector: 'app-estado-cocheras',
  standalone: true,
  imports: [RouterLink, NgClass, CommonModule],
  templateUrl: './estado-cocheras.component.html',
  styleUrl: './estado-cocheras.component.scss'
})
export class EstadoCocherasComponent {
  titulo: string = "Parking App";
  cocheras: Cocheras[] = [];
  isAdmin: boolean = false;
  toggleAdmin() {
    this.isAdmin = !this.isAdmin;
  }

  // Inyecta el servicio utilizando 'inject()'
  dataCocherasService = inject(DataCocherasService);

  constructor(private router: Router) {} // Inyecta el Router
  // Usar el servicio para agregar una cochera
  agregarCochera() {
    this.dataCocherasService.agregarCochera();
  }

  // Usar el servicio para alternar la disponibilidad
  toggleDisponibilidad(index: number) {
    this.dataCocherasService.toggleDisponibilidad(index);
  }

  // Usar el servicio para confirmar y borrar una cochera
  confirmDeleteCochera(index: number) {
    this.dataCocherasService.confirmDeleteCochera(index);
  }

  // Usar el servicio para cerrar sesión con confirmación
  confirmLogout(event: Event) {
    this.dataCocherasService.confirmLogout(event);
  }
}
