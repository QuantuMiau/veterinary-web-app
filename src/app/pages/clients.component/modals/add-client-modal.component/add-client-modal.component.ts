import { Component, EventEmitter, inject, Output, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { modalContentAnimation, modalOverlayAnimation } from '../../../../shared/animations';

@Component({
  selector: 'app-add-client-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-client-modal.component.html',
  animations: [modalOverlayAnimation, modalContentAnimation]
})
export class AddClientModalComponent {
  @Input() errorMessage = '';
  @Input() successMessage = '';
  @Input() isLoading = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  private fb = inject(FormBuilder);

  clientForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    motherName: [''],
    phone: ['', [Validators.required, Validators.maxLength(15)]],
    address: ['', Validators.required],
    city: ['', Validators.required]
  });

  submit() {
    if (this.clientForm.valid) {
      this.save.emit(this.clientForm.value);
    }
  }
}
