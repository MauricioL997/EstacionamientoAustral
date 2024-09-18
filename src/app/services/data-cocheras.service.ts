import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router'; // Importa Router
import { Cocheras } from '../interfaces/cochera';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class DataCocherasService {
  cocheras: Cocheras[] = [];

  ultimoNumero = this.cocheras[this.cocheras.length - 1]?.numero || 0;
  authService: Inject(Data);

  constructor(private router: Router) {
    this.getCocheras()
  }



  agregarCochera() {
    this.cocheras.push({
      id: this.ultimoNumero + 1,
      disponible: "disponible",
      ingreso: "-",
      esGrande: true
    });
    this.ultimoNumero++; 
  }

  toggleDisponibilidad(index: number) {
    if (this.cocheras[index].disponible === "disponible") {
      this.cocheras[index].disponible = "deshabilitada";
    } else {
      this.cocheras[index].disponible = "disponible";
    }
  }

  confirmDeleteCochera(index: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta cochera será eliminada permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.borrarCochera(index);
        Swal.fire('¡Eliminado!', 'La cochera ha sido eliminada exitosamente.', 'success');
      }
    });
  }

  borrarCochera(index: number) {
    this.cocheras.splice(index, 1); 
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
  async getCocheras(){
    const res = await fetch('http://Localhost:4000/cochera',{
      headers:{
        authorization: 'Bearer '+this.authService.usuario?.token
      }
    })
  if (res.status !==200) return;
  const resJson:Cocheras[] = await res.json();
  this.cocheras=resJson;
  //this.router.navigate(['/EstadoCochera'])
}
}
