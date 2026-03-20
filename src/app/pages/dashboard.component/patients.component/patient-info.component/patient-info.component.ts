import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../../../services/patient-service';
import { PatientDetailed } from '../../../../models/patient.model';
import { ClientService } from '../../../../services/client.service';
import { Client } from '../../../../models/client.model';
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
  private cdr = inject(ChangeDetectorRef);

  patient?: PatientDetailed;
  clients: Client[] = [];
  isLoading = true;

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
      if (id) {
        this.patientService.getPatientById(id).subscribe({
          next: (patient) => {
            this.patient = patient;
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
}
