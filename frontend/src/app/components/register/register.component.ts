import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  user = {
    username: '',
    email: '',
    password: ''
  };

  confirmPassword = '';
  errorMessage = '';

  constructor(private http: HttpClient) { }

  createUser() {

    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    if (!this.passwordMeetsCriteria(this.user.password)) {
      this.errorMessage = 'La contraseña debe tener al menos un número y una mayúscula.';
      return;
    }

    this.http.post('http://localhost:3000/create-user', this.user)
      /*     this.http.post('https://api.storylinematch.com/create-user', this.user) */
      .subscribe({
        next: (response) => console.log(response),
        error: (error) => {
          console.error(error);
          this.handleError(error);
        }
      });
  }

  passwordMeetsCriteria(password: string): boolean {
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    return hasNumber && hasUpper;
  }

  handleError(error: any) {
    if (error.status === 500) { // Suponiendo que el backend devuelve 409 para conflictos como usuario o email existente
      this.errorMessage = 'El usuario o el email ya existen.';
    } else {
      this.errorMessage = 'Error al registrar el usuario.';
    }
  }

}
