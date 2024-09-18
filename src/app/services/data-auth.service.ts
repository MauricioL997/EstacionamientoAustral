import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class DataAuthService {

  constructor() { }

    usuario: Usuario | undefined; 
}
