import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cocheras } from '../../interfaces/cochera';
import { CommonModule, NgClass } from '@angular/common';


@Component({
  selector: 'app-estado-cocheras',
  standalone: true,
  imports: [RouterLink,NgClass,CommonModule],
  templateUrl: './estado-cocheras.component.html',
  styleUrl: './estado-cocheras.component.scss'
})
export class EstadoCocherasComponent {
  titulo:string = "Parking App";

  cocheras:Cocheras[] = []

  ultimoNumero = this.cocheras[this.cocheras.length-1]?.numero || 0;

  isAdmin: boolean = false;
  toggleAdmin() {
    this.isAdmin = !this.isAdmin;
  }
  agregarCochera(){
    this.cocheras.push({
      numero: this.ultimoNumero + 1,
      disponible: "disponible",
      ingreso:"-",
      esGrande:true
    })
    this.ultimoNumero ++;
  }
  toggleDisponibilidad(index: number){
  if(this.cocheras[index].disponible ==="disponible") {
    this.cocheras[index].disponible="deshabilitada";
  } else {
    this.cocheras[index].disponible="disponible";
  }
}
borrarCochera(index : number){
  this.cocheras.splice(index,1);
}


}