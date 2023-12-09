import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-request-reset-password',
  templateUrl: './request-reset-password.component.html',
  styleUrls: ['./request-reset-password.component.scss']
})
export class RequestResetPasswordComponent {

  email = '';
  message = '';
  showModal: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router
    ) {}

  requestPasswordReset() {
    this.userService.requestPasswordReset(this.email).subscribe({
      next: (res: any) => {

        this.message = res.message;
        console.log(res);
        this.showModal = true;

        setTimeout(() => {
          this.showModal = false;
          this.router.navigate(['/']);
        }, 5000);

      },
      error: error => {
        console.error('Error al solicitar el restablecimiento de contraseña:', error);
        this.message = error.error.message;
        console.log(this.message)
      }
    });
  }

  closeModal() {
    this.showModal = false;
  }

}
