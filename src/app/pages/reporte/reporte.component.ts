import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataEstacionamientosService } from '../../services/data.estacionamiento.service';


@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.scss'
})
export class ReporteComponent {
  dataEstacionamientoService = inject(DataEstacionamientosService)

}
