import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userInfo: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserInfo().subscribe({
      next: (data) => {
        
        this.userInfo = data;
        this.userInfo.created_at = new Date(this.userInfo.created_at).toLocaleDateString('en-CA');
        console.log(this.userInfo)
      },
      error: (err) => {
        console.error('Error al obtener la información del usuario:', err);
        // Manejar el error (mostrar mensaje al usuario, etc.)
      }
    });
  }
}
