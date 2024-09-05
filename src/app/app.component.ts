import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { EstadoCocherasComponent } from './pages/estado-cocheras/estado-cocheras.component';
import { LoginComponent } from './pages/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ProyectoCochera';
}
