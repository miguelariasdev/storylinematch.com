import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  loginUser() {
    this.http.post('http://localhost:3000/login', this.loginData)
      .subscribe(response => {
        console.log(response);
        // Manejar la respuesta, como guardar el token, etc.
/*         localStorage.setItem('token', response.token);
        this.router.navigate(['/ruta-de-la-aplicacion']); */

      }, error => {
        console.error(error);
        // Manejar el error
      });
  } 

}
