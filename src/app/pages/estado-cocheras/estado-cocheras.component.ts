import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
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

  isAdmin: boolean = true;

  dataCocherasService = inject(DataCocherasService);
  authService: any;

  constructor(private router: Router) {} 
  agregarCochera() {
    this.dataCocherasService.agregarCochera();
  }

  toggleDisponibilidad(index: number) {
    this.dataCocherasService.toggleDisponibilidad(index);
  }

  confirmDeleteCochera(index: number) {
    this.dataCocherasService.confirmDeleteCochera(index);
  }

  confirmLogout(event: Event) {
    this.dataCocherasService.confirmLogout(event);
  }
 async getCocheras(){
    const res = await fetch('http://Localhost:4000/cochera',{
      headers:{
        authorization: 'Bearer '+this.authService.usuario?.token
      }
    })
  if (res.status !==200) return;
  //const resJson:ResLogin = await res.json();
  //this.router.navigate(['/EstadoCochera'])
}

}



