import { Component } from '@angular/core';
import { AddEventModalComponent } from './modals/add-event-modal/add-event-modal.component';

@Component({
  selector: 'app-calendar',
  imports: [AddEventModalComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
  showAddEventModal = false;

  openAddEventModal() {
    this.showAddEventModal = true;
  }

  closeModal() {
    this.showAddEventModal = false;
  }
}
