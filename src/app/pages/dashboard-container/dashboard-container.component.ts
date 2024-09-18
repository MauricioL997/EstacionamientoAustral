import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { EstadoCocherasComponent } from '../estado-cocheras/estado-cocheras.component';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, EstadoCocherasComponent],
  templateUrl: './dashboard-container.component.html',
  styleUrl: './dashboard-container.component.scss'
})
export class DashboardContainerComponent {
  isAdmin: boolean = false;
  
  toggleAdmin() {
    this.isAdmin = !this.isAdmin;
  }
}
