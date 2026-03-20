import { Component, EventEmitter, Output, Input, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientDetailed } from '../../../../../../models/patient.model';
import { modalContentAnimation, modalOverlayAnimation } from '../../../../../../shared/animations';

@Component({
  selector: 'app-patient-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-delete-modal.html',
  animations: [modalOverlayAnimation, modalContentAnimation]
})
export class PatientDeleteModal {
  @Input() patient!: PatientDetailed;
  @Input() errorMessage = '';
  @Input() successMessage = '';
  @Input() isSaving = false;

  @Output() close = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<number>();

  confirm() {
    const id = this.patient.patient_id;
    if (id) {
      this.confirmDelete.emit(id);
    }
  }

  cancel() {
    this.close.emit();
  }

}
