import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DataAuthService } from '../../services/data-auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  authService = inject(DataAuthService);
  router = inject(Router);
  errorLogin = false;

  async login(loginForm: NgForm) {
    const { username, password } = loginForm.value;
    const loginData = { username, password };
    
    const res = await this.authService.login(loginData);

    // Verificar si el login fue exitoso
    if (res) {
      if (res.status === 200) {
        this.router.navigate(['EstadoCochera']);
      } else {
        // Si el login falló, mostrar el error en SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Error en el inicio de sesión',
          text: 'Credenciales incorrectas o el usuario no es válido',
        });
        this.errorLogin = true;
      }
    } else {
      // Si no hay respuesta válida (null), mostrar error general
      Swal.fire({
        icon: 'error',
        title: 'Error en el inicio de sesión',
        text: 'No se pudo conectar con el servidor. Verifica tu conexión.',
      });
      this.errorLogin = true;
    }
  }
}
