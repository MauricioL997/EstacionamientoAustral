import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Register } from '../../interfaces/register';
import { DataAuthService } from '../../services/data-auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink,FormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  authService = inject(DataAuthService);
  router = inject(Router);
  errorRegister= false;

  async register(registerForm: NgForm) {
    const { username, nombre, apellido, password } = registerForm.value;
    const registerData: Register = { username, nombre, apellido, password };
    const res = await this.authService.register(registerData);
  
    if (res) {
      this.router.navigate(['/login']).then(() => {
        Swal.fire("Registro exitoso", "", "success");
      });
    } else {
      this.errorRegister = true;
    }
  }
}
