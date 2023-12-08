  import { Component } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Router } from '@angular/router';
  import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

  @Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
  })
  export class RegisterComponent {

    user = {
      username: '',
      name: '',
      lastname: '',
      middle_name: '',
      email: '',
      password: ''
    };

    registerForm: FormGroup;

    confirmPassword = '';
    errorMessage = '';

    constructor(
      private http: HttpClient,
      private router: Router,
      private fb: FormBuilder,) {

      this.registerForm = this.fb.group({
        username: ['', [Validators.required, Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9]+$'), Validators.maxLength(20), Validators.minLength(4)]],
        name: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+'), Validators.maxLength(30), Validators.minLength(3)]],
        lastname: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+'), Validators.maxLength(30), Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(7), this.passwordValidator]],
        confirmPassword: ['']
      }, { validator: this.matchPassword });
    }

    createUser() {

      if (this.registerForm.invalid) {
        this.errorMessage = 'Please complete all fields correctly.';
        console.log(this.registerForm);
        console.log(this.registerForm.invalid)
        return;
      }

      if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }

      this.http.post('http://localhost:3000/create-user', this.registerForm.value)
        .subscribe({
          next: (response) => {
            console.log(response)
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error(error);
            this.handleError(error);
          }
        });
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

    handleError(error: any) {
      if (error.status === 500) { // Suponiendo que el backend devuelve 409 para conflictos como usuario o email existente
        this.errorMessage = 'El usuario o el email ya existen.';
      } else {
        this.errorMessage = 'Error al registrar el usuario.';
      }
    }

  }
