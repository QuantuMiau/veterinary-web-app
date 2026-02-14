import {Component, EventEmitter, inject, Output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-user-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-user-modal.component.html',
  styleUrl: './edit-user-modal.component.css',
})
export class EditUserModalComponent {
  private fb = inject(FormBuilder);


  @Output() close = new EventEmitter<void>();

  userForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/)]],
    role: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
  });

  submit() {
    if (this.userForm.invalid) return;

    console.log(this.userForm.value);
    this.close.emit();
    console.log("se guardo")
  }
}
