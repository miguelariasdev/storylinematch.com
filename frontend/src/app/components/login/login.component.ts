import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { LoginResponse } from 'src/app/models/login-response.interface';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginData = {
    email: '',
    password: ''
  }

  errorMessage = '';

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {
    if (this.userService.isAuthenticated()) {
      this.router.navigate(['/movie-search']);
    }
  }

  ngOnInit(){

  }

  login(email: string, password: string) {
    this.userService.login(email, password).subscribe({
      next: (res) => {
        console.log(res)
        localStorage.setItem('token', res.token); // Almacena el token
        this.router.navigate(['/movie-search']); // Redirige al usuario
      },
      error: (err) => {

        // Verificar si el error es un error HTTP y tiene un mensaje
      if (err.error && err.error.message) {
        this.errorMessage = err.error.message;
      } else {
        // Manejar otros tipos de errores (como errores de red)
        this.errorMessage = 'An error occurred while trying to log in. Please try again later.';
      }
      console.error(err);

      }
    });
  }
  
}
