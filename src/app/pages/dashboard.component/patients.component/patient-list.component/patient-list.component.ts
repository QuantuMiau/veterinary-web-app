import { Component, inject} from '@angular/core';
import {AddModalComponent} from './modals/add-modal.component/add-modal.component';
import {PatientEditModal} from './modals/patient-edit-modal/patient-edit-modal';
import {PatientDeleteModal} from './modals/patient-delete-modal/patient-delete-modal';
import {Patient, PatientService} from '../../../../services/patient-service';
import {NgClass} from '@angular/common';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-patient-list.component',
  imports: [
    AddModalComponent,
    PatientEditModal,
    PatientDeleteModal,
    NgClass,
    FormsModule
  ],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css',
})
export class PatientListComponent {
  showAddPatientModal = false;
  showEditPatientModal = false;
  showDeletePatientModal = false;
  selectedPatient!: Patient;

  searchTerm: string = '';
  filteredPatients: Patient[] = [];

  patients: Patient[] = [];

  constructor(private patientService: PatientService) {
    this.patients = this.patientService.getPatients();
    this.filteredPatients = [...this.patients];
  }

  private router = inject(Router);

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

  goToDetails(patient: Patient) {
    this.router.navigate(['/dashboard/pacientes/paciente', patient.id]);

  }

  searchPatients() {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredPatients = [...this.patients];
      return;
    }

    this.filteredPatients = this.patients.filter(patient =>
      patient.name.toLowerCase().includes(term)
    );
  }


}
