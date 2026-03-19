import { Component, EventEmitter, inject, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { modalContentAnimation, modalOverlayAnimation } from '../../../../shared/animations';
import { Client } from '../../../../services/client.service';

@Component({
  selector: 'app-edit-client-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-client-modal.component.html',
  animations: [modalOverlayAnimation, modalContentAnimation]
})
export class EditClientModalComponent implements OnChanges {
  @Input() client: Client | null = null;
  @Input() errorMessage = '';
  @Input() successMessage = '';
  @Input() isLoading = false;
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Client>();

  private fb = inject(FormBuilder);

  clientForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    motherName: [''],
    phone: ['', [Validators.required, Validators.maxLength(15)]],
    address: ['', Validators.required],
    city: ['', Validators.required]
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['client'] && this.client) {
      this.clientForm.patchValue({
        firstName: this.client.firstName || this.client.first_name || '',
        lastName: this.client.lastName || this.client.last_name || '',
        motherName: this.client.motherName || this.client.mother_name || '',
        phone: this.client.phone || '',
        address: this.client.address || '',
        city: this.client.city || ''
      });
    }
  }

  submit() {
    if (this.clientForm.valid && this.client) {
      const updatedClient: Client = {
        ...this.client,
        ...this.clientForm.value as any
      };
      this.save.emit(updatedClient);
    }
  }
}
