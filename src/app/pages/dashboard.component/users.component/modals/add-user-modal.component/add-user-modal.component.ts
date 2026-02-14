import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-user-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.css',
})
export class AddUserModalComponent {
  private fb = inject(FormBuilder);

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  userForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/),
      ],
    ],
    role: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
  });

  submit() {
    if (this.userForm.invalid) return;

    const payload = this.userForm.value;
    this.save.emit(payload);
    this.close.emit();
  }
}
