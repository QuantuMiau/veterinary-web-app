import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService, Patient } from '../../../../services/patient-service';
import { PatientHeaderComponent } from './patient-header.component/patient-header.component';
import { PatientTabsComponent } from './patient-tabs.component/patient-tabs.component';

@Component({
  selector: 'app-patient-info',
  standalone: true,
  imports: [
    PatientHeaderComponent,
    PatientTabsComponent
  ],
  templateUrl: './patient-info.component.html',
  styleUrl: './patient-info.component.css',
})
export class PatientInfoComponent implements OnInit {

  patient?: Patient;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.patient = this.patientService
        .getPatients()
        .find(p => p.id === id);
    });
  }
}
