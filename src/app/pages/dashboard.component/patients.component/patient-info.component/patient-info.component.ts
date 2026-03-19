import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService, Patient } from '../../../../services/patient-service';
import { ClientService, Client } from '../../../../services/client.service';
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

  patient?: Patient;
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
            this.patient = this.mapPatientData(patient);
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

  private mapPatientData(patient: Patient): Patient {
    const p = { ...patient };
    
    // Prioritize direct and new API View fields
    p.name = p.name || p.paciente_nombre || (p as any).patient_name || (p as any).nombre;
    p.breed = p.breed || p.raza;
    p.sex = p.sex || p.sexo;
    p.species = p.species || p.especie;
    p.owner = p.full_name || p.dueno_nombre_completo || p.owner;
    p.telefono = p.phone || p.telefono;
    p.ciudad = p.city || p.ciudad;
    
    // Owner mapping fallback (if not in direct response)
    if (!p.owner) {
      const clientId = p.clientId || p.client_id || (p as any).id_cliente;
      if (clientId) {
        const client = this.clients.find(c => (c.id || c.client_id) === Number(clientId));
        if (client) {
          p.owner = `${client.firstName || client.first_name || ''} ${client.lastName || client.last_name || ''}`.trim();
        }
      }
    }
    
    // Species mapping fallback
    if (!p.species) {
      const sId = p.speciesId || p.species_id || (p as any).id_especie;
      const speciesList = [
        { id: 1, name: 'Perro' },
        { id: 2, name: 'Gato' },
        { id: 3, name: 'Conejo' },
        { id: 4, name: 'Ave' }
      ];
      const species = speciesList.find(s => s.id === Number(sId));
      if (species) p.species = species.name;
    }

    return p;
  }
}
