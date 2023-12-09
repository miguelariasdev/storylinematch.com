import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent {

  message: string = '';
  showModal: boolean = false;

  constructor (
    private route: ActivatedRoute, 
    private http: HttpClient,
    private router: Router
    ) {

  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.verifyEmail(token);
      } else {
        this.message = 'Token de verificación no proporcionado.';
      }
    });

  }

  verifyEmail(token: string) {
    // Llamar al endpoint de verificación
    /* this.http.get(`http://localhost:3000/verify-email?token=${token}`) */
    this.http.get(`https://storylinematch.com/verify-email?token=${token}`)
      .subscribe({
        next: (response: any) => {
          this.message = response.message;

          this.showModal = true;

           setTimeout(() => {
            this.showModal = false;
            this.router.navigate(['/']);
          }, 3000);
        },
        error: (error) => {
          this.message = 'Error verifying email.';
          this.showModal = true;
        }
      });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

}
