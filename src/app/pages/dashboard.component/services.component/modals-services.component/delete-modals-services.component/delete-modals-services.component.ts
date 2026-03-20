import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../../../../models/service.model';
import { modalContentAnimation, modalOverlayAnimation } from '../../../../../shared/animations';

@Component({
  selector: 'app-delete-modals-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-modals-services.component.html',
  styleUrl: './delete-modals-services.component.css',
  animations: [modalOverlayAnimation, modalContentAnimation]
})
export class DeleteModalsServicesComponent {
  @Input() service?: Service;
  @Input() serviceId?: number;
  @Input() isSaving = false;
  @Input() errorMessage = '';
  @Input() successMessage = '';
  
  @Output() close = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<number>();

  confirm() {
    const id = this.serviceId || this.service?.concept_id;
    if (id) {
      this.confirmDelete.emit(id);
    }
  }
}
