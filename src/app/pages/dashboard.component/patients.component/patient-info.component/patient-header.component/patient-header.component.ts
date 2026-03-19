import { Component, inject, Input} from '@angular/core';
import {Router} from '@angular/router';
import {Patient} from '../../../../../services/patient-service';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-patient-header',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './patient-header.component.html',
  styleUrl: './patient-header.component.css',
})
export class PatientHeaderComponent {

  @Input() patient!: Patient;

  private router = inject(Router);

  goBack() {
    this.router.navigate(['/dashboard/pacientes/lista']);
  }

}
