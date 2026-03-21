import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PatientDetailed } from '../../../../../models/patient.model';
import { ClinicalRecord } from '../../../../../models/clinical-record.model';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-patient-header',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './patient-header.component.html',
  styleUrl: './patient-header.component.css',
})
export class PatientHeaderComponent {
  @Input() patient!: PatientDetailed;
  @Input() lastRecord?: ClinicalRecord | null;

  private router = inject(Router);

  goBack() {
    this.router.navigate(['/admin/dashboard/pacientes/lista']);
  }
}
