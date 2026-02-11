import { Component } from '@angular/core';
import {AddModalComponent} from './modals/add-modal.component/add-modal.component';

@Component({
  selector: 'app-patient-list.component',
  imports: [
    AddModalComponent
  ],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css',
})
export class PatientListComponent {
  showAddPatientModal = false;

  openModal() {
    this.showAddPatientModal = true;
    console.log(this.showAddPatientModal);
  }

  closeModal() {
    this.showAddPatientModal = false;
  }
}
