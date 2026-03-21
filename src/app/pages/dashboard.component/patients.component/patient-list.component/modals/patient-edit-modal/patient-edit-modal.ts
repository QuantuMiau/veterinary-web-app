import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Patient, PatientDetailed } from '../../../../../../models/patient.model';
import { ClientService } from '../../../../../../services/client.service';
import { Client } from '../../../../../../models/client.model';
import { modalContentAnimation, modalOverlayAnimation } from '../../../../../../shared/animations';

@Component({
  selector: 'app-patient-edit-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './patient-edit-modal.html',
  animations: [modalOverlayAnimation, modalContentAnimation]
})
export class PatientEditModal implements OnChanges, OnInit {
  @Input() patient: PatientDetailed | null = null;
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

  patientForm = this.fb.group({
    name: ['', Validators.required],
    client_id: [null as number | null, [Validators.required, Validators.min(1)]],
    species_id: [null as number | null, [Validators.required, Validators.min(1)]],
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

      let sId = this.patient.species_id;
      const speciesName = this.patient.species;
      if (!sId && speciesName) {
        const s = speciesName.toLowerCase();
        if(s === 'perro') sId = 1;
        else if(s === 'gato') sId = 2;
        else if(s === 'conejo') sId = 3;
        else if(s === 'ave') sId = 4;
      }

      const cId = this.patient.client_id;

      this.patientForm.patchValue({
        name: this.patient.name || '',
        client_id: cId ? Number(cId) : null,
        species_id: sId ? Number(sId) : null,
        breed: this.patient.breed || '',
        color: this.patient.color || '',
        sex: this.patient.sex || ''
      });
    }
  }

  submit() {
    if (this.patientForm.valid && this.patient) {
      const updatedPatient: Patient = {
        ...this.patient,
        ...this.patientForm.value as any
      };
      this.save.emit(updatedPatient);
    }
  }
}
