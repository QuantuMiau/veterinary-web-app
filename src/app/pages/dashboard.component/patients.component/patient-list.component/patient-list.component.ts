import { Component } from '@angular/core';
import {AddModalComponent} from './modals/add-modal.component/add-modal.component';
import {PatientEditModal} from './modals/patient-edit-modal/patient-edit-modal';
import {PatientDeleteModal} from './modals/patient-delete-modal/patient-delete-modal';

@Component({
  selector: 'app-patient-list.component',
  imports: [
    AddModalComponent,
    PatientEditModal,
    PatientDeleteModal
  ],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css',
})
export class PatientListComponent {
  showAddPatientModal = false;
  showEditPatientModal = false;
  showDeletePatientModal = false;

  openNewPatient() {
    this.showAddPatientModal = true;
    console.log(this.showAddPatientModal);
  }

  openEditPatientModal() {
    this.showEditPatientModal = true;
    console.log(this.showEditPatientModal);
  }

  openDeletePatientModal() {
    this.showDeletePatientModal = true;
  }

  closeModal() {
    this.showAddPatientModal = false;
    this.showEditPatientModal = false;
    this.showDeletePatientModal = false;
  }


}
