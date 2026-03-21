import { Component, EventEmitter, inject, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { modalContentAnimation, modalOverlayAnimation } from '../../../../shared/animations';
import { Client } from '../../../../models/client.model';

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
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    mother_name: [''],
    phone: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/^[0-9]+$/)]],
    address: ['', Validators.required],
    city: ['', Validators.required]
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['client'] && this.client) {
      this.clientForm.patchValue({
        first_name: this.client.first_name || '',
        last_name: this.client.last_name || '',
        mother_name: this.client.mother_name || '',
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
