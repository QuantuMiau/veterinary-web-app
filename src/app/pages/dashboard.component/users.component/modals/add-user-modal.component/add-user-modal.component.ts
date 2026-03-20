import { Component, EventEmitter, inject, Output, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { modalContentAnimation, modalOverlayAnimation } from '../../../../../shared/animations';

@Component({
  selector: 'app-add-user-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.css',
  animations: [modalContentAnimation, modalOverlayAnimation]
})
export class AddUserModalComponent {
  private fb = inject(FormBuilder);

  @Input() errorMessage = '';
  @Input() successMessage = '';
  @Input() isLoading = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  userForm = this.fb.group({
    first_name: ['', [Validators.required, Validators.minLength(3)]],
    last_name: ['', [Validators.required, Validators.minLength(3)]],
    mother_name: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['Empleado', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
  });

  submit() {
    if (this.userForm.invalid) return;

    const payload = this.userForm.value;
    this.save.emit(payload);
  }
}
