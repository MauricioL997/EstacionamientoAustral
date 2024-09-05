import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cocheras } from '../../interfaces/cochera';


@Component({
  selector: 'app-estado-cocheras',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './estado-cocheras.component.html',
  styleUrl: './estado-cocheras.component.scss'
})
export class EstadoCocherasComponent {
  titulo:string = "Estado cocheras";

  cocheras:Cocheras[] = []
  actualizarCocheras() {
    this.cocheras = []
    }
  ultimoNumero = this.cocheras[this.cocheras.length-1]?.numero || 0;

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
    this.cocheras[index].disponible="desabilitada";
  } else {
    this.cocheras[index].disponible="disponible";
  }
}
borrarCochera(index : number){
  this.cocheras.splice(index,1);
}
}