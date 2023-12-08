import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  menuVisible: boolean = false;

  constructor(
    private http: HttpClient,
    public userService: UserService, 
    private router: Router
  ) {}

  ngOnInit(){

  }

  logout() {
    this.userService.logout(); // Llama al método de logout de tu UserService
    this.router.navigate(['/']); // Redirige al usuario a la página de login
  }

  toggleMenu(): void {
    this.menuVisible = !this.menuVisible;
  }

}
