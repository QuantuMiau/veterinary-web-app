import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../../../../models/appointment.model';
import { modalContentAnimation, modalOverlayAnimation } from '../../../../../shared/animations';

@Component({
  selector: 'app-event-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-detail-modal.component.html',
  animations: [modalOverlayAnimation, modalContentAnimation]
})
export class EventDetailModalComponent {
  @Input() appointment: Appointment | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();

  onClose() {
    this.close.emit();
  }

  onDelete() {
    if (this.appointment?._id) {
      this.delete.emit(this.appointment._id);
    }
  }
}
