import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Patient } from '../../../../../../services/patient-service';
import { ClientService, Client } from '../../../../../../services/client.service';
import { modalContentAnimation, modalOverlayAnimation } from '../../../../../../shared/animations';

@Component({
  selector: 'app-patient-edit-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './patient-edit-modal.html',
  animations: [modalOverlayAnimation, modalContentAnimation]
})
export class PatientEditModal implements OnChanges, OnInit {
  @Input() patient: Patient | null = null;
  @Input() errorMessage = '';
  @Input() successMessage = '';
  @Input() isLoading = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Patient>();

  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private cdr = inject(ChangeDetectorRef);

  clients: Client[] = [];
  speciesList = [
    { id: 1, name: 'Perro' },
    { id: 2, name: 'Gato' },
    { id: 3, name: 'Conejo' },
    { id: 4, name: 'Ave' }
  ];

  patientEditForm = this.fb.group({
    name: ['', Validators.required],
    clientId: [null as number | null, Validators.required],
    speciesId: [null as number | null, Validators.required],
    breed: [''],
    color: [''],
    sex: ['', Validators.required]
  });

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getAll().subscribe({
      next: (res: any) => {
        this.clients = Array.isArray(res) ? res : (res.data || []);
        this.cdr.detectChanges();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['patient'] && this.patient) {
      console.log('Patient to edit:', this.patient);

      let sId = this.patient.speciesId || this.patient.species_id || (this.patient as any).id_especie;
      if (!sId && (this.patient.species || (this.patient as any).species_name)) {
        const sName = (this.patient.species || (this.patient as any).species_name || '').toLowerCase();
        const found = this.speciesList.find(s => s.name.toLowerCase() === sName);
        if (found) sId = found.id;
      }

      const cId = this.patient.clientId || this.patient.client_id || (this.patient as any).id_cliente;

      this.patientEditForm.patchValue({
        name: this.patient.name || (this.patient as any).patient_name || (this.patient as any).nombre || '',
        clientId: cId ? Number(cId) : null,
        speciesId: sId ? Number(sId) : null,
        breed: this.patient.breed || (this.patient as any).raza || '',
        color: this.patient.color || '',
        sex: this.patient.sex || (this.patient as any).sexo || ''
      });
    }
  }

  submit() {
    if (this.patientEditForm.valid && this.patient) {
      const updatedPatient: Patient = {
        ...this.patient,
        ...this.patientEditForm.value as any
      };
      this.save.emit(updatedPatient);
    }
  }
}
