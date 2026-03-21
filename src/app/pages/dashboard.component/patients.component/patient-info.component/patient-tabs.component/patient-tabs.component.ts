import { Component, Input } from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {VisitsTableComponent} from '../tabs/visits-table.component/visits-table.component';
import {RxTableComponent} from '../tabs/rx-table.component/rx-table.component';
import {LabsTableComponent} from '../tabs/labs-table.component/labs-table.component';

@Component({
  selector: 'app-patient-tabs',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    VisitsTableComponent,
    RxTableComponent,
    LabsTableComponent,
    NgIf
  ],
  templateUrl: './patient-tabs.component.html',
  styleUrl: './patient-tabs.component.css',
})
export class PatientTabsComponent {

  @Input() patientId: number = 0;

  activeTab = 'visits';

  tabs = [
    { id: 'visits', label: 'Visitas / Vacunas', icon: 'fa-notes-medical' },
    { id: 'rx', label: 'RX', icon: 'fa-xray' },
    { id: 'labs', label: 'Laboratorios', icon: 'fa-flask-vial' }
  ];

}
