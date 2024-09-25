import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Login, ResLogin } from '../../interfaces/login';
import { DataAuthService } from '../../services/data-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  authService = inject(DataAuthService);
  loginData: Login ={
    username:'admin',
    password:'admin'
  }

  router = inject(Router);
//login(){
//  console.log('login button clicked');
//  fetch('http://Localhost:4000/login',{
//    method: 'POST',
//    headers: {
//      'Content-Type': 'application/json',
//    },
//    body: JSON.stringify(this.loginData)
//  }).then(res => {
//    console.log("tengo respuesta del back",res)
//    res.json().then(resJson => {
//      console.log(resJson)
//    })
//  })
//  
//    console.log("despues del fetch")
//}
errorLogin = false;
async login(){
  const res = await this.authService.login(this.loginData)
  if(res?.status === "ok") this.router.navigate(['/EstadoCochera']);
  else this.errorLogin = true;
}
}
