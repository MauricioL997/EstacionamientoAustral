import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Login, ResLogin } from '../../interfaces/login';
import { DataAuthService } from '../../services/data-auth.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports:[RouterLink,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  authService = inject(DataAuthService);
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
async login(loginForm: NgForm){
  const{usuario,password} =loginForm.value;
  const loginData : Login ={username:usuario, password}
  const res = await this.authService.login(loginData)
  if(res?.status === "ok") this.router.navigate(['/EstadoCochera']);
  else this.errorLogin = true;
}
}
