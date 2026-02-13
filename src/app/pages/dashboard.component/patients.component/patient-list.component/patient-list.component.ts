import { Component } from '@angular/core';
import {AddModalComponent} from './modals/add-modal.component/add-modal.component';
import {PatientEditModal} from './modals/patient-edit-modal/patient-edit-modal';

@Component({
  selector: 'app-patient-list.component',
  imports: [
    AddModalComponent,
    PatientEditModal
  ],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css',
})
export class PatientListComponent {
  showAddPatientModal = false;
  showEditPatientModal = false;

  openNewPatient() {
    this.showAddPatientModal = true;
    console.log(this.showAddPatientModal);
  }

  closeModal() {
    this.showAddPatientModal = false;
    this.showEditPatientModal = false;
  }

  openEditPatientModal() {
    this.showEditPatientModal = true;
    console.log(this.showEditPatientModal);
  }


}
