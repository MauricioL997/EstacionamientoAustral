import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.scss'
})
export class ReporteComponent {
  titulo:string = "Parking App";
  isAdmin: boolean = false;
  toggleAdmin() {
    this.isAdmin = !this.isAdmin;}

}
