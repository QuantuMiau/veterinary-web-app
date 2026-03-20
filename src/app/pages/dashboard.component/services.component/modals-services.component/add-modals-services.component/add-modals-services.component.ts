import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Service } from '../../../../../models/service.model';
import { modalContentAnimation, modalOverlayAnimation } from '../../../../../shared/animations';

@Component({
  selector: 'app-add-modals-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-modals-services.component.html',
  styleUrl: './add-modals-services.component.css',
  animations: [modalOverlayAnimation, modalContentAnimation]
})
export class AddModalsServicesComponent {
  private fb = inject(FormBuilder);

  @Input() isSaving = false;
  @Input() errorMessage = '';
  @Input() successMessage = '';
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Service>();

  serviceForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    cost: ['', [Validators.required, Validators.min(0)]],
    price: ['', [Validators.required, Validators.min(0)]],
    duration: ['00:30:00', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)]],
  });

  submit() {
    if (this.serviceForm.invalid) return;

    const formValue = this.serviceForm.value;
    const serviceData: Service = {
      name: formValue.name!,
      cost: Number(formValue.cost),
      price: Number(formValue.price),
      duration: formValue.duration!,
      active: true
    };

    this.save.emit(serviceData);
  }
}
