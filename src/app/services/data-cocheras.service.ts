import { inject, Injectable } from '@angular/core';
import { Cochera } from '../interfaces/cochera';
import { DataAuthService } from './data-auth.service';
import { Estacionamiento } from '../interfaces/estacionamiento';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataCocherasService {
  cocheras: Cochera[] = [];
  estacionamientos: Estacionamiento[] = [];
  authService = inject(DataAuthService);
  
  constructor() {
    this.loadData();
  }

  async loadData() {
    await this.getCocheras();
    await this.getEstacionamientos();
    this.asociarEstacionamientosConCocheras();
  }

  async getCocheras() {
    const token = this.authService.getToken();
    if (!token) {
      console.error("Token no disponible");
      return;
    }
    const res = await fetch(`${environment.API_URL}Cochera`, {
      headers: {
        authorization: 'Bearer ' + token
      }
    });
    if (res.status !== 200) return;
    const resJson: Cochera[] = await res.json();
    this.cocheras = resJson;
  }

  async getEstacionamientos() {
    const token = this.authService.getToken();
    if (!token) {
      console.error("Token no disponible");
      return;
    }
    const res = await fetch(`${environment.API_URL}Estacionamiento`, {
      method : 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) {
      console.error("Error al obtener estacionamientos:", await res.text());
      return;
    }
    this.estacionamientos = await res.json();
  }

  asociarEstacionamientosConCocheras() {
    this.cocheras = this.cocheras.map(cochera => {
      const estacionamiento = this.estacionamientos.find(e => e.idCochera === cochera.id);
      return { ...cochera, estacionamiento };
    });
    console.log(this.cocheras);
  }

  async agregarCochera(descripcion: string) {
    const token = this.authService.getToken();
    if (!token) {
      console.error("Token no disponible");
      return;
    }
    const cochera = { descripcion };
    const res = await fetch(`${environment.API_URL}Cochera`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token
      },
      body: JSON.stringify(cochera)
    });
    if (res.status !== 200) {
      console.log("Error en la creación de una nueva cochera");
    } else {
      console.log("Creación de cochera exitosa");
      this.loadData();
    }
  }

  async borrarFila(id: number) {
    const token = this.authService.getToken();
    if (!token) {
      console.error("Token no disponible");
      return;
    }
    const res = await fetch(`${environment.API_URL}Cochera/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token
      }
    });
    if (res.status !== 200) {
      console.log('Error en la eliminación de la cochera');
    } else {
      console.log('Cochera eliminada con éxito');
      this.loadData();
    }
  }

  async deshabilitarCochera(idCochera: number) {
    const token = this.authService.getToken();
    if (!token) {
      console.error("Token no disponible");
      return;
    }
    const res = await fetch(`${environment.API_URL}Cochera/disable/${idCochera}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token
      }
    });
    if (res.status === 200) {
      console.log("Cochera deshabilitada");
      this.loadData();
    } else {
      console.warn("Error deshabilitando cochera");
    }
  }

  async habilitarCochera(idCochera: number) {
    const token = this.authService.getToken();
    if (!token) {
      console.error("Token no disponible");
      return;
    }
    const res = await fetch(`${environment.API_URL}Cochera/enable/${idCochera}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token
      }
    });
    if (res.status === 200) {
      console.log("Cochera habilitada");
      this.loadData();
    } else {
      console.warn("Error habilitando cochera");
    }
  }

  async abrirEstacionamiento(patente: string, idUsuarioIngreso: string, idCochera: number) {
    const token = this.authService.getToken();
    if (!token) {
      console.error("Token no disponible");
      return;
    }
    const body = { patente, idUsuarioIngreso, idCochera };
    const res = await fetch(`${environment.API_URL}Estacionamiento/abrir`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token
      },
      body: JSON.stringify(body)
    });
    if (res.status !== 200) {
      console.log("Error en abrir estacionamiento");
    } else {
      console.log("Creación de estacionamiento exitoso");
      this.loadData();
    }
  }

  async cerrarEstacionamiento(patente: string, idUsuarioEgreso: string) {
    const token = this.authService.getToken();
    if (!token) {
      console.error("Token no disponible");
      return;
    }
    const body = { patente, idUsuarioEgreso };
    const res = await fetch(`${environment.API_URL}Estacionamiento/cerrar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token
      },
      body: JSON.stringify(body)
    });
    if (res.status !== 200) {
      console.log("Error en el cerrado del estacionamiento");
    } else {
      console.log("Cerrado del estacionamiento exitoso");
      this.loadData();
    }
  }
  async deleteEstacionamiento(id: number): Promise<void> {
    const token = this.authService.getToken();
    if (!token) {
      console.error("Token no disponible");
      return;
    }

    return fetch(`${environment.API_URL}Estacionamiento/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token  // Se incluye el token para la autenticación
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error("Error al eliminar el estacionamiento.");
      }
    });
  }
}
