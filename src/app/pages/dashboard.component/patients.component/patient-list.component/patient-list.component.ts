import { Component } from '@angular/core';
import {AddModalComponent} from './modals/add-modal.component/add-modal.component';
import {PatientEditModal} from './modals/patient-edit-modal/patient-edit-modal';
import {PatientDeleteModal} from './modals/patient-delete-modal/patient-delete-modal';
import {Patient, PatientService} from '../../../../services/patient-service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-patient-list.component',
  imports: [
    AddModalComponent,
    PatientEditModal,
    PatientDeleteModal,
    NgClass
  ],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css',
})
export class PatientListComponent {
  showAddPatientModal = false;
  showEditPatientModal = false;
  showDeletePatientModal = false;
  selectedPatient!: Patient;

  patients: Patient[] = [];

  constructor(private patientService: PatientService,) {
    this.patients = this.patientService.getPatients();
  }

  openNewPatient() {
    this.showAddPatientModal = true;
    console.log(this.showAddPatientModal);
  }

  openEditPatientModal(patient: Patient) {
    this.selectedPatient = patient;
    this.showEditPatientModal = true;
  }


  openDeletePatientModal(patient: Patient) {
    this.selectedPatient = patient;
    this.showDeletePatientModal = true;
  }
  closeModal() {
    this.showAddPatientModal = false;
    this.showEditPatientModal = false;
    this.showDeletePatientModal = false;
  }

  deletePatient(id: number) {
    this.patientService.deletePatient(id);
    this.closeModal();
  }

  updatePatient(updatedPatient: Patient) {
    this.patientService.updatePatient(updatedPatient);
    this.closeModal();
  }


}
