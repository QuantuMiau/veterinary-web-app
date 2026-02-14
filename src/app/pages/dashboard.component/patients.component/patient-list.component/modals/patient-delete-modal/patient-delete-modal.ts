import { Component, EventEmitter, Output, Input} from '@angular/core';
import {Patient} from '../../../../../../services/patient-service';

@Component({
  selector: 'app-patient-delete-modal',
  imports: [],
  templateUrl: './patient-delete-modal.html',
  styleUrl: './patient-delete-modal.css',
})
export class PatientDeleteModal {
  @Input() patient!: Patient;

  @Output() close = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<number>();

  confirm() {
    console.log("hola")
    this.confirmDelete.emit(this.patient.id);
    this.close.emit();
  }

  cancel() {
    this.close.emit();
  }

}
