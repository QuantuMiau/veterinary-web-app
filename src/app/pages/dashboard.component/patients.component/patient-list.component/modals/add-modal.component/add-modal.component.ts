import { Component, EventEmitter, inject, Output, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../../../../services/patient-service';
import { ClientService } from '../../../../../../services/client.service';
import { Client } from '../../../../../../models/client.model';
import { modalContentAnimation, modalOverlayAnimation } from '../../../../../../shared/animations';

@Component({
  selector: 'app-patient-add-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-modal.component.html',
  animations: [modalOverlayAnimation, modalContentAnimation]
})
export class AddModalComponent implements OnInit {
  @Input() errorMessage = '';
  @Input() successMessage = '';
  @Input() isLoading = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

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
    color: [''],
    breed: [''],
    sex: ['', Validators.required],
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

  submit() {
    if (this.patientForm.valid) {
      this.save.emit(this.patientForm.value);
    }
  }
}
