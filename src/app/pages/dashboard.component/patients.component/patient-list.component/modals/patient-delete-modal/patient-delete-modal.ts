import { Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-patient-delete-modal',
  imports: [],
  templateUrl: './patient-delete-modal.html',
  styleUrl: './patient-delete-modal.css',
})
export class PatientDeleteModal {

  @Output() close = new EventEmitter<void>();

  @Output() confirmDelete = new EventEmitter<string>();

  constructor() {}

  confirm() {
    console.log("eliminado")
    this.close.emit();
  }

  cancel() {
    this.close.emit();
  }

}
