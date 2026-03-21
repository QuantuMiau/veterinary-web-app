import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddModalComponent } from './modals/add-modal.component/add-modal.component';
import { PatientEditModal } from './modals/patient-edit-modal/patient-edit-modal';
import { PatientDeleteModal } from './modals/patient-delete-modal/patient-delete-modal';
import { PatientDetailed, Patient } from '../../../../models/patient.model';
import { PatientService } from '../../../../services/patient-service';
import { Client } from '../../../../models/client.model';
import { ClientService } from '../../../../services/client.service';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-list.component',
  standalone: true,
  imports: [
    AddModalComponent,
    PatientEditModal,
    PatientDeleteModal,
    NgClass,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientListComponent implements OnInit {
  private patientService = inject(PatientService);
  private clientService = inject(ClientService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  patients: PatientDetailed[] = [];
  clients: Client[] = [];
  searchTerm: string = '';

  showAddPatientModal = false;
  showEditPatientModal = false;
  showDeletePatientModal = false;

  selectedPatient: PatientDetailed | null = null;

  isSaving = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  get filteredPatients(): PatientDetailed[] {
    if (!this.searchTerm.trim()) return this.patients;

    const t = this.searchTerm.toLowerCase();
    return this.patients.filter((p) => {
      const pName = (p.name || '').toLowerCase();
      const pBreed = (p.breed || '').toLowerCase();
      const pOwner = this.getOwnerName(p).toLowerCase();

      return pName.includes(t) || pBreed.includes(t) || pOwner.includes(t);
    });
  }

  getSpeciesColor(patient: PatientDetailed): string {
    const sId = patient.species_id;
    const sName = (patient.species || '').toLowerCase();

    if (sId === 1 || sName.includes('perro')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (sId === 2 || sName.includes('gato'))
      return 'bg-orange-100 text-orange-700 border-orange-200';
    if (sId === 3 || sName.includes('conejo')) return 'bg-teal-100 text-teal-700 border-teal-200';
    if (sId === 4 || sName.includes('ave'))
      return 'bg-purple-100 text-purple-700 border-purple-200';

    return 'bg-gray-100 text-gray-700 border-gray-200';
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.clientService.getAll().subscribe({
      next: (res: any) => {
        this.clients = Array.isArray(res) ? res : res.data || [];
        this.loadPatients();
      },
      error: (err) => {
        console.error('Error loading clients', err);
        this.loadPatients();
      },
    });
  }

  loadPatients() {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.patientService.getPatients().subscribe({
      next: (res: any) => {
        this.patients = Array.isArray(res) ? res : res.data || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading patients', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  getOwnerName(patient: PatientDetailed): string {
    if (patient.owner_name) return patient.owner_name;
    if (patient.full_name) return patient.full_name;

    const clientId = patient.client_id;
    if (clientId) {
      const client = this.clients.find((c) => c.client_id === clientId);
      if (client) {
        return `${client.first_name || ''} ${client.last_name || ''}`.trim();
      }
    }

    // por si no tiene dueno no asignado xd
    return (patient as any).client_name || (patient as any).full_name || 'No asignado';
  }

  private parseError(err: any): string {
    if (err.error) {
      if (typeof err.error === 'string') return err.error;
      if (err.error.message) return err.error.message;
      if (err.error.error) return err.error.error;
    }
    return err.message || 'Error inesperado en el servidor';
  }

  updateSearch(term: string) {
    this.searchTerm = term;
    this.cdr.detectChanges();
  }

  openNewPatient() {
    this.errorMessage = '';
    this.successMessage = '';
    this.showAddPatientModal = true;
    this.cdr.detectChanges();
  }

  openEditPatientModal(patient: Patient) {
    this.errorMessage = '';
    this.successMessage = '';
    this.selectedPatient = patient;
    this.showEditPatientModal = true;
    this.cdr.detectChanges();
  }

  openDeletePatientModal(patient: Patient) {
    this.errorMessage = '';
    this.successMessage = '';
    this.selectedPatient = patient;
    this.showDeletePatientModal = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showAddPatientModal = false;
    this.showEditPatientModal = false;
    this.showDeletePatientModal = false;
    this.selectedPatient = null;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();
  }

  addPatient(patientData: any) {
    this.errorMessage = '';
    this.successMessage = '';
    this.isSaving = true;

    this.patientService.addPatient(patientData).subscribe({
      next: (res: any) => {
        this.successMessage = res.message || 'Paciente registrado exitosamente';
        this.isSaving = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.loadPatients();
          this.closeModal();
        }, 1500);
      },
      error: (err: any) => {
        console.error('Error adding patient', err);
        this.isSaving = false;
        this.errorMessage = this.parseError(err);
        this.cdr.detectChanges();
      },
    });
  }

  updatePatient(updatedPatient: Patient) {
    this.errorMessage = '';
    this.successMessage = '';
    this.isSaving = true;

    const targetId = updatedPatient.patient_id;
    if (!targetId) {
      this.isSaving = false;
      this.errorMessage = 'ID de paciente no encontrado';
      return;
    }

    this.patientService.updatePatient(targetId, updatedPatient).subscribe({
      next: (res: any) => {
        this.successMessage = res.message || 'Paciente actualizado exitosamente';
        this.isSaving = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.loadPatients();
          this.closeModal();
        }, 1500);
      },
      error: (err: any) => {
        console.error('Error updating patient', err);
        this.isSaving = false;
        this.errorMessage = this.parseError(err);
        this.cdr.detectChanges();
      },
    });
  }

  goToDetails(patient: Patient) {
    const id = patient.patient_id;
    this.router.navigate(['/admin/dashboard/pacientes/paciente', id]);
  }

  deletePatient(id: number) {
    this.errorMessage = '';
    this.successMessage = '';
    this.isSaving = true;
    this.cdr.detectChanges();

    this.patientService.deletePatient(id).subscribe({
      next: (res: any) => {
        this.successMessage = res.message || 'Paciente eliminado exitosamente';
        this.isSaving = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.loadPatients();
          this.closeModal();
        }, 1500);
      },
      error: (err: any) => {
        console.error('Error deleting patient', err);
        this.isSaving = false;
        this.errorMessage = this.parseError(err);
        this.cdr.detectChanges();
      },
    });
  }
}
