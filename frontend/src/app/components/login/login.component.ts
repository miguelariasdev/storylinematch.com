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
    username: '',
    password: ''
  }

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

  login(username: string, password: string) {
    this.userService.login(username, password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token); // Almacena el token
        this.router.navigate(['/movie-search']); // Redirige al usuario
      },
      error: (err) => {
        console.error(err); // Maneja errores como credenciales incorrectas
      }
    });
  }
  
}
