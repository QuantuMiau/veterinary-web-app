import { Component, EventEmitter, Output, inject, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Appointment } from '../../../../../models/appointment.model';
import { modalContentAnimation, modalOverlayAnimation } from '../../../../../shared/animations';

@Component({
  selector: 'app-add-event-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-event-modal.component.html',
  styleUrl: './add-event-modal.component.css',
  animations: [modalOverlayAnimation, modalContentAnimation]
})
export class AddEventModalComponent implements OnInit {
  @Input() initialDate: string | null = null;
  @Input() initialTime: string | null = null;
  @Input() existingAppointments: Appointment[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Appointment>();

  appointmentForm: FormGroup;
  private fb = inject(FormBuilder);

  times: string[] = [];

  constructor() {
    this.appointmentForm = this.fb.group({
      personName: ['', Validators.required],
      petType: ['perro', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      reason: ['', Validators.required],
      description: ['']
    });

    this.generateTimes();
  }

  ngOnInit() {
    if (this.initialDate) {
      this.appointmentForm.patchValue({ date: this.initialDate });
    } else {
      const today = new Date().toISOString().split('h')[0];
      const todayFormatted = new Date().toISOString().split('T')[0];
      this.appointmentForm.patchValue({ date: todayFormatted });
    }

    if (this.initialTime) {
      this.appointmentForm.patchValue({ time: this.initialTime });
    } else {
      setTimeout(() => {
        if (!this.appointmentForm.get('time')?.value) {
          const firstAvailable = this.availableTimes[0];
          if (firstAvailable) {
            this.appointmentForm.patchValue({ time: firstAvailable });
          }
        }
      }, 50);
    }
  }

  get availableTimes(): string[] {
    const selectedDate = this.appointmentForm.get('date')?.value;
    if (!selectedDate) return this.times;

    // Filter appointments for the selected date
    const takenTimes = this.existingAppointments
      .filter(app => app.date === selectedDate)
      .map(app => app.time.substring(0, 5));

    return this.times.filter(time => !takenTimes.includes(time));
  }

  generateTimes() {
    for (let h = 9; h <= 21; h++) {
      const hour = h.toString().padStart(2, '0');
      this.times.push(`${hour}:00`);
      if (h < 21) {
        this.times.push(`${hour}:30`);
      }
    }
  }

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      this.save.emit(this.appointmentForm.value);
    }
  }
}
