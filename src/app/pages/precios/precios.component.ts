import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-precios',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './precios.component.html',
  styleUrl: './precios.component.scss'
})
export class PreciosComponent {
  titulo:string = "Parking App";
  isAdmin: boolean = false;
  toggleAdmin() {
    this.isAdmin = !this.isAdmin;}

}
