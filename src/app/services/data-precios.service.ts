import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Precio } from '../interfaces/precios';
import { DataAuthService } from './data-auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataPreciosService {
  private apiUrl = `${environment.API_URL}Tarifa`;

  constructor(private authService: DataAuthService) {}

  getPrecios(): Promise<Precio[]> {
    return fetch(this.apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    })
    .then(res => {
      if (!res.ok) {
        return res.text().then(text => {
          console.error("Error al obtener los precios:", text);
          throw new Error('Error al obtener los precios');
        });
      }
      return res.json();
    })
    .catch(error => {
      console.error('Error en la solicitud GET:', error);
      throw error;
    });
  }

  updatePrecio(precio: Precio): Promise<any> {
    return fetch(`${this.apiUrl}/${precio.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken()}`
      },
      body: JSON.stringify(precio)
    })
    .then(res => {
      if (!res.ok) {
        return res.text().then(text => {
          console.error("Error al actualizar el precio:", text);
          throw new Error('Error al actualizar el precio');
        });
      }
      return res.json();
    })
    .catch(error => {
      console.error('Error en la solicitud PUT:', error);
      throw error;
    });
  }

  deletePrecio(id: number): Promise<any> {
    return fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    })
    .then(res => {
      if (!res.ok) {
        return res.text().then(text => {
          console.error("Error al borrar el precio:", text);
          throw new Error('Error al borrar el precio');
        });
      }
      return res.json();
    })
    .catch(error => {
      console.error('Error en la solicitud DELETE:', error);
      throw error;
    });
  }

  async createPrecio(precio: Precio): Promise<void> {
    console.log("Objeto precio antes de enviar:", precio); // <-- Para verificar el contenido
    const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authService.getToken()}`
        },
        body: JSON.stringify(precio)
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Error al crear el precio:", errorText);
        throw new Error('Error al crear el precio');
    }
    console.log("Precio creado con éxito");
}

}
