import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { modalContentAnimation, modalOverlayAnimation } from '../../../../../shared/animations';

@Component({
  selector: 'app-edit-user-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-user-modal.component.html',
  styleUrl: './edit-user-modal.component.css',
  animations: [modalContentAnimation, modalOverlayAnimation]
})
export class EditUserModalComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() user?: any;
  @Input() errorMessage = '';
  @Input() successMessage = '';
  @Input() isLoading = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  userForm = this.fb.group({
    first_name: ['', [Validators.required, Validators.minLength(3)]],
    last_name: ['', [Validators.required, Validators.minLength(3)]],
    mother_name: ['', [Validators.required, Validators.minLength(3)]],
    role: ['Empleado', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      this.userForm.patchValue({
        first_name: this.user.first_name || '',
        last_name: this.user.last_name || '',
        mother_name: this.user.mother_name || '',
        role: this.user.role,
        email: this.user.email,
        phone: this.user.phone,
      });
    }
  }

  submit() {
    if (this.userForm.invalid) return;

    const payload = { ...(this.userForm.value as any) };
    const id = this.user?.employee_id;
    
    if (id) {
       payload.employee_id = id;
    }

    this.save.emit(payload);
  }
}
