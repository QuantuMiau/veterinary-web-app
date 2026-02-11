import { Component, inject} from '@angular/core';
import {PatientHeaderComponent} from './patient-header.component/patient-header.component';
import {PatientTabsComponent} from './patient-tabs.component/patient-tabs.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-patient-info',
  imports: [
    PatientHeaderComponent,
    PatientTabsComponent
  ],
  templateUrl: './patient-info.component.html',
  styleUrl: './patient-info.component.css',
})
export class PatientInfoComponent {


}
