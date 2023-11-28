import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { LoginResponse } from 'src/app/models/login-response.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'storylinematch';

  isLoggedIn: boolean = false;

  constructor(
    private userService: UserService
  ){}

  ngOnInit(){
    
    const token = localStorage.getItem('token');
    if (token) {
      // Si hay un token, considera que el usuario está logueado
      this.userService.login();
    }

    this.userService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

  }
}
