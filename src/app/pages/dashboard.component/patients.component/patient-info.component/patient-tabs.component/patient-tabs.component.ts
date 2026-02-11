import { Component } from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {VisitsTableComponent} from '../tabs/visits-table.component/visits-table.component';
import {RxTableComponent} from '../tabs/rx-table.component/rx-table.component';
import {LabsTableComponent} from '../tabs/labs-table.component/labs-table.component';

@Component({
  selector: 'app-patient-tabs',
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

  activeTab = 'visits';

  tabs = [
    { id: 'visits', label: 'Visitas' },
    { id: 'rx', label: 'RX' },
    { id: 'labs', label: 'Laboratorios' }
  ];


}
