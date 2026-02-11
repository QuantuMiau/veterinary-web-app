import { Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {

  private formBuilder = inject(FormBuilder);

  private router = inject(Router);

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
  console.log(email, password);
  this.router.navigate(['dashboard/home']);
}

}
