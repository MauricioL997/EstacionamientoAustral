import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';
import { Login, ResLogin } from '../interfaces/login';
import { NgForm } from '@angular/forms';
import { Register, ResRegister } from '../interfaces/register';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataAuthService {



  constructor() { 
    const token = this.getToken();
    if(token){
      if(!this.usuario) this.usuario = {
        username: '',
        token: token,
        esAdmin: false
      }
      else this.usuario!.token = token;
    }
  }

    usuario: Usuario | undefined; 

    async login(loginData: Login) {
      try {
          const res = await fetch(`${environment.API_URL}Authenticate`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(loginData)
          });
  
          if (!res.ok) {
              const errorText = await res.text();
              console.error("Error en el inicio de sesión:", errorText);
              return;
          }
  
          const token = await res.text();
          if (!token) {
              console.error("No se recibió un token de autenticación.");
              return;
          }
  
          this.usuario = {
              username: loginData.username,
              token: token,
              esAdmin: false
          };
  
          localStorage.setItem("authToken", token);
  
          const userDetailsRes = await fetch(`${environment.API_URL}User/by-username/${encodeURIComponent(loginData.username)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });     
  
          if (!userDetailsRes.ok) {
              const errorDetails = await userDetailsRes.text();
              console.error("Error en la solicitud de detalles del usuario:", errorDetails);
              return;
          }
  
          const userDetailsResJson = await userDetailsRes.json();
          this.usuario.esAdmin = userDetailsResJson.esAdmin;
  
          return userDetailsRes;
      } catch (error) {
          console.error("Error en el proceso de inicio de sesión:", error);
          return null;
      }
  }
  
  
    async register(registerData: Register) {
      try {
        const res = await fetch(`${environment.API_URL}User/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(registerData)
        });
    
        if (!res.ok) {
          // Obtener el mensaje de error específico
          const errorText = await res.text();
          console.error("Error en el registro del usuario:", errorText);
    
          // Comprobar el mensaje de error específico
          if (errorText.includes("El nombre de usuario ya está en uso")) {
            throw new Error("El nombre de usuario ya está en uso");
          } else {
            throw new Error("Error en el registro del usuario");
          }
        }
    
        // Suponiendo que el backend devuelve un objeto con un campo "mensaje"
        const resJson: ResRegister = await res.json();
        console.log("Usuario registrado con éxito:", resJson.mensaje);
        return resJson;
    
      } catch (error:any) {
        console.error("Error en el proceso de registro:", error.message);
        return null;
      }
    }
    
    
  getToken() {
    return localStorage.getItem("authToken");
  }

  clearToken() {
    localStorage.removeItem("authToken");
    this.usuario = undefined; // Limpiar el estado del usuario también
  }
}
