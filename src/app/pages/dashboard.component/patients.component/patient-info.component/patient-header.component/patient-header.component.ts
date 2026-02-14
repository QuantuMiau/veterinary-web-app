import { Component, inject, Input} from '@angular/core';
import {Router} from '@angular/router';
import {Patient} from '../../../../../services/patient-service';

@Component({
  selector: 'app-patient-header',
  imports: [],
  templateUrl: './patient-header.component.html',
  styleUrl: './patient-header.component.css',
})
export class PatientHeaderComponent {

  @Input() patient!: Patient;

  private router = inject(Router);

  goBack() {
    this.router.navigate(['dashboard/pacientes/lista']);
  }

}
