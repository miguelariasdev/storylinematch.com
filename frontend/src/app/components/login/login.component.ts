import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { LoginResponse } from 'src/app/models/login-response.interface';

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
    private userService: UserService
  ) {}

  ngOnInit(){

  }

  loginUser() {
    this.http.post<LoginResponse>('http://localhost:3000/login', this.loginData)
      .subscribe(response => {

        console.log(response);

        if (response.token) {
          localStorage.setItem('token', response.token);
          this.userService.login();
          console.log(response)
        }

        // Manejar la respuesta, como guardar el token, etc.
/*         localStorage.setItem('token', response.token);
        this.router.navigate(['/ruta-de-la-aplicacion']); */

      }, error => {
        console.error(error);
        this.userService.logout();
        // Manejar el error
      });
  } 

}
