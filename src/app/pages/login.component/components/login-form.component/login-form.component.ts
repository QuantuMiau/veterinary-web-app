import { Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'login-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  loginError = '';

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit() {
    if (this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }

    const {email, password}  = this.loginForm.value;
    
    if (email && password) {
      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['dashboard/home']);
        },
        error: (err: any) => {
          console.error('Login failed', err);
          this.loginError = 'Credenciales inválidas o error en el servidor.';
        }
      });
    }
  }

}
