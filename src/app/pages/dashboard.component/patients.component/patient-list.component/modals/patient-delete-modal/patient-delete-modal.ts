import { Component, EventEmitter, Output, Input, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Patient } from '../../../../../../services/patient-service';
import { modalContentAnimation, modalOverlayAnimation } from '../../../../../../shared/animations';

@Component({
  selector: 'app-patient-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-delete-modal.html',
  animations: [modalOverlayAnimation, modalContentAnimation]
})
export class PatientDeleteModal {
  @Input() patient!: Patient;
  @Input() errorMessage = '';
  @Input() successMessage = '';
  @Input() isSaving = false;

  @Output() close = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<number>();

  confirm() {
    const id = this.patient.id || (this.patient as any).patientId || (this.patient as any).patient_id;
    if (id) {
      this.confirmDelete.emit(id);
    }
  }

  cancel() {
    this.close.emit();
  }

}
