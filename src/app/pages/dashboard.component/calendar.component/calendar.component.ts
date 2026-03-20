import { Component, OnInit, inject, ChangeDetectorRef, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarOptions } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import { AddEventModalComponent } from './modals/add-event-modal/add-event-modal.component';
import { EventDetailModalComponent } from './modals/event-detail-modal/event-detail-modal.component';
import { ConfirmationModalComponent } from './modals/confirmation-modal/confirmation-modal.component';
import { AppointmentService } from '../../../services/appointment.service';
import { Appointment } from '../../../models/appointment.model';
import { modalContentAnimation, modalOverlayAnimation } from '../../../shared/animations';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, AddEventModalComponent, EventDetailModalComponent, ConfirmationModalComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  animations: [modalOverlayAnimation, modalContentAnimation]
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  private appointmentService = inject(AppointmentService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  showAddEventModal = false;
  selectedAppointment: Appointment | null = null;
  allAppointments: Appointment[] = [];
  initialDate: string | null = null;
  initialTime: string | null = null;

  showDeleteConfirm = false;
  appointmentIdToDelete: string | null = null;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    height: '100%',
    slotMinTime: '09:00:00',
    slotMaxTime: '21:00:00',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    editable: true,
    selectable: true,
    dayMaxEvents: true,
    locale: 'es',
    locales: [esLocale],
    navLinks: true,
    eventColor: '#0d9488', // Teal 600
    eventTextColor: '#ffffff',
    events: this.loadEvents.bind(this),
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventDidMount: (info) => {
      const app = info.event.extendedProps as any;
      if (app) {
        info.el.setAttribute('data-time', app.time || '');
        info.el.setAttribute('data-pet', app.petType || '');
      }
    },
    slotLaneDidMount: (info) => {
      if (info.date) {
        const time = info.date.getHours().toString().padStart(2, '0') + ':' +
          info.date.getMinutes().toString().padStart(2, '0');
        info.el.setAttribute('data-time', time);
      }
    }
  };

  ngOnInit() {
  }

  loadEvents(info: any, successCallback: any, failureCallback: any) {
    this.appointmentService.getAppointments().subscribe({
      next: (appointments) => {
        this.allAppointments = appointments;
        const events = appointments.map(app => ({
          id: app._id,
          title: `${app.petType}: ${app.personName}`,
          start: `${app.date}T${app.time}`,
          extendedProps: { ...app }
        }));
        this.zone.run(() => {
          successCallback(events);
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Error loading appointments', err);
        this.zone.run(() => failureCallback(err));
      }
    });
  }

  handleDateClick(arg: any) {
    console.log('--- DATE CLICK ---', arg.dateStr);
    this.zone.run(() => {
      this.closeModal();
      if (!this.calendarComponent) {
        console.error('No calendar component!');
        return;
      }
      const calendarApi = this.calendarComponent.getApi();
      const currentView = calendarApi.view.type;
      console.log('Current View:', currentView);

      if (currentView === 'dayGridMonth') {
        calendarApi.changeView('timeGridDay', arg.dateStr);
      } else {
        const dateParts = arg.dateStr.split('T');
        this.initialDate = dateParts[0];
        this.initialTime = dateParts[1] ? dateParts[1].substring(0, 5) : null;
        console.log('Pre-filling:', this.initialDate, this.initialTime);
        this.showAddEventModal = true;
      }
      this.cdr.detectChanges();
    });
  }

  handleEventClick(arg: any) {
    console.log('--- EVENT CLICK ---', arg.event.title);
    this.zone.run(() => {
      this.closeModal();
      if (!this.calendarComponent) return;
      const calendarApi = this.calendarComponent.getApi();
      const currentView = calendarApi.view.type;
      console.log('Current View:', currentView);

      if (currentView === 'dayGridMonth') {
        const eventDate = arg.event.startStr.split('T')[0];
        calendarApi.changeView('timeGridDay', eventDate);
      } else {
        const props = arg.event.extendedProps;
        this.selectedAppointment = {
          _id: arg.event.id || props._id,
          personName: props.personName || '',
          petType: props.petType || '',
          date: props.date || '',
          time: props.time || '',
          reason: props.reason || '',
          description: props.description || '',
          status: props.status || ''
        };
        console.log('Selected App:', this.selectedAppointment);
      }
      this.cdr.detectChanges();
    });
  }

  openAddEventModal() {
    this.zone.run(() => {
      this.closeModal();
      this.showAddEventModal = true;
      this.cdr.detectChanges();
    });
  }

  closeModal() {
    console.log('Resetting all modal states...');
    this.showAddEventModal = false;
    this.selectedAppointment = null;
    this.initialDate = null;
    this.initialTime = null;
    this.showDeleteConfirm = false;
    this.appointmentIdToDelete = null;
    this.cdr.detectChanges();
  }

  saveAppointment(appointment: Appointment) {
    this.appointmentService.createAppointment(appointment).subscribe({
      next: () => {
        this.closeModal();
        this.refetchEvents();
      },
      error: (err) => console.error('Error saving appointment', err)
    });
  }

  deleteAppointment(id: string) {
    this.appointmentIdToDelete = id;
    this.showDeleteConfirm = true;
    this.cdr.detectChanges();
  }

  confirmDelete() {
    if (this.appointmentIdToDelete) {
      this.appointmentService.deleteAppointment(this.appointmentIdToDelete).subscribe({
        next: () => {
          this.closeModal();
          this.refetchEvents();
        },
        error: (err) => {
          console.error('Error deleting appointment', err);
          this.closeModal();
        }
      });
    }
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.appointmentIdToDelete = null;
    this.cdr.detectChanges();
  }

  private refetchEvents() {
    const calendarApi = this.calendarComponent.getApi();
    if (calendarApi) {
      calendarApi.refetchEvents();
    }
  }
}
