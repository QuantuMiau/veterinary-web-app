import { Component, inject} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-patient-header',
  imports: [],
  templateUrl: './patient-header.component.html',
  styleUrl: './patient-header.component.css',
})
export class PatientHeaderComponent {

  private router = inject(Router);

  goBack() {
    this.router.navigate(['dashboard/pacientes/lista']);
  }

}
