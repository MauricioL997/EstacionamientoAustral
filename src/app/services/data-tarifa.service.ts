import { inject, Injectable } from '@angular/core';
import { Tarifa } from '../interfaces/tarifa';
import { DataAuthService } from './data-auth.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DataTarifasService {
    tarifas: Tarifa[] = []
    authService = inject(DataAuthService);

    constructor() { 
        this.getTarifas();
    }

    // Obtener todas las tarifas
    async getTarifas(): Promise<void> {
        try {
            const res = await fetch(`${environment.API_URL}Tarifa`, {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.usuario?.token,
                    'Content-Type': 'application/json'
                },
            });
    
            if (!res.ok) {
                console.error("Error al obtener las tarifas:", res.statusText);
                return;
            }
    
            this.tarifas = await res.json();
            console.log("Tarifas cargadas con éxito:", this.tarifas);
    
        } catch (error) {
            console.error("Error al obtener las tarifas:", error);
        }
    }
    
    // Crear una nueva tarifa
    async createTarifa(tarifa: Tarifa): Promise<void> {
        const res = await fetch(environment.API_URL + 'Tarifa', {  // Cambio aquí
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + this.authService.usuario?.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarifa)
        });

        if (!res.ok) {
            throw new Error('Error al crear la tarifa');
        } else {
            console.log("Tarifa creada con éxito");
            this.getTarifas(); // Actualiza la lista de tarifas
        }
    }

    // Actualizar una tarifa existente
    async updateTarifa(tarifa: Tarifa): Promise<void> {
        const res = await fetch(`${environment.API_URL}Tarifa/${tarifa.id}`, {  // Cambio aquí
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + this.authService.usuario?.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarifa)
        });

        if (!res.ok) {
            throw new Error('Error al actualizar la tarifa');
        } else {
            console.log("Tarifa actualizada con éxito");
            this.getTarifas(); // Actualiza la lista de tarifas
        }
    }

    // Eliminar una tarifa por ID
    async deleteTarifa(id: number): Promise<void> {
        const res = await fetch(`${environment.API_URL}Tarifa/${id}`, {  // Cambio aquí
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + this.authService.usuario?.token,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('Error al eliminar la tarifa');
        } else {
            console.log("Tarifa eliminada con éxito");
            this.getTarifas(); // Actualiza la lista de tarifas
        }
    }
}
