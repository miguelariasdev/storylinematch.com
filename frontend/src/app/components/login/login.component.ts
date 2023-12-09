import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { LoginResponse } from 'src/app/models/login-response.interface';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;

  errorMessage = '';

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    if (this.userService.isAuthenticated()) {
      this.router.navigate(['/movie-search']);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

  }

  ngOnInit() {

  }

  login() {

    if (this.loginForm.valid) {

      const { email, password } = this.loginForm.value;

      this.userService.login(email, password).subscribe({

        next: (res) => {

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

    } else {
      this.errorMessage = 'Please fill in all fields correctly.';
    }
  }

}
