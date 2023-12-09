import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';


import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  /*   newPassword = ''; */
  token = '';

  message = '';
  showModal: boolean = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router) {

    this.token = this.route.snapshot.queryParams['token'];

    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(7), this.passwordValidator]],
      confirmPassword: ['']
      }, { validator: this.matchPassword });

  }

  ngOnInit(): void {
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const noSpaces = /^\S*$/.test(password);

    if (!hasNumber || !hasUpper || !noSpaces) {
      return { passwordStrength: true };
    }
    return null;
  }

  matchPassword(group: FormGroup): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
  
    if (!password || !confirmPassword) {
      // Uno o ambos controles aún no están definidos, no podemos realizar la comparación.
      return null;
    }
  
    return password.value === confirmPassword.value ? null : { notSame: true };
  }

  resetPassword() {
    // Verificar si el formulario es válido
    if (this.resetPasswordForm.valid) {
      // Obtener el control de newPassword de forma segura
      const newPasswordControl = this.resetPasswordForm.get('password');

      // Verificar si newPasswordControl no es nulo y tiene un valor
      if (newPasswordControl && newPasswordControl.value) {
        this.userService.resetPassword(this.token, newPasswordControl.value).subscribe({
          next: (res) => {
            this.message = res.message;
            this.showModal = true;
    
            setTimeout(() => {
              this.showModal = false;
              this.router.navigate(['/']);
            }, 5000);
          },
          error: (error) => {
            console.error('Password reset error: ', error);
            this.message = error.error;
          }
        });
      }
    } else {
      // Manejar el caso en que el formulario no sea válido
      this.message = 'Please fill out the form correctly.';
    }
  }


  closeModal() {
    this.showModal = false;
  }

}
