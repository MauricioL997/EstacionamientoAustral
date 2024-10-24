import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { EstadoCocherasComponent } from '../estado-cocheras/estado-cocheras.component';
import { DataAuthService } from '../../services/data-auth.service';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, EstadoCocherasComponent],
  templateUrl: './dashboard-container.component.html',
  styleUrl: './dashboard-container.component.scss'
})
export class DashboardContainerComponent {
  isAdmin = true;
  authService = inject(DataAuthService);
  router = inject(Router);

  cerrarSesion(){
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }
}
