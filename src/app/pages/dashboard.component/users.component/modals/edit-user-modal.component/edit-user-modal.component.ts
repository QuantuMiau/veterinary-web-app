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

@Component({
  selector: 'app-edit-user-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-user-modal.component.html',
  styleUrl: './edit-user-modal.component.css',
})
export class EditUserModalComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() user?: any;
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      this.userForm.patchValue({
        name: this.user.name,
        role: this.user.role,
        email: this.user.email,
        phone: this.user.phone,
      });
    }
  }

  submit() {
    if (this.userForm.invalid) return;

    const payload = { ...(this.userForm.value as any) };
    if (this.user && this.user.id) payload.id = this.user.id;

    this.save.emit(payload);
    this.close.emit();
  }
}
