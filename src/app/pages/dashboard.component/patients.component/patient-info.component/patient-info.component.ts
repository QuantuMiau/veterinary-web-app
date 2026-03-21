import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../../../services/patient-service';
import { PatientDetailed } from '../../../../models/patient.model';
import { ClientService } from '../../../../services/client.service';
import { Client } from '../../../../models/client.model';
import { ClinicalRecordService } from '../../../../services/clinical-record.service';
import { ClinicalRecord } from '../../../../models/clinical-record.model';
import { PatientHeaderComponent } from './patient-header.component/patient-header.component';
import { PatientTabsComponent } from './patient-tabs.component/patient-tabs.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-info',
  standalone: true,
  imports: [
    PatientHeaderComponent,
    PatientTabsComponent,
    CommonModule
  ],
  templateUrl: './patient-info.component.html',
  styleUrl: './patient-info.component.css',
})
export class PatientInfoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private patientService = inject(PatientService);
  private clientService = inject(ClientService);
  private clinicalRecordService = inject(ClinicalRecordService);
  private cdr = inject(ChangeDetectorRef);

  patient?: PatientDetailed;
  lastRecord?: ClinicalRecord | null;
  clients: Client[] = [];
  isLoading = true;
  patientId: number = 0;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.clientService.getAll().subscribe({
      next: (res: any) => {
        this.clients = Array.isArray(res) ? res : (res.data || []);
        this.fetchPatient();
      },
      error: (err) => {
        console.error('Error loading clients', err);
        this.fetchPatient();
      }
    });
  }

  fetchPatient() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.patientId = id;
      if (id) {
        this.patientService.getPatientById(id).subscribe({
          next: (patient) => {
            this.patient = patient;
            this.fetchLatestRecord(id);
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error fetching patient details', err);
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      } else {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  fetchLatestRecord(patientId: number) {
    this.clinicalRecordService.getLatestByPatient(patientId).subscribe({
      next: (record) => {
        this.lastRecord = record;
        this.cdr.detectChanges();
      }
    });
  }
}
