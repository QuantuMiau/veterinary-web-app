import { Component, EventEmitter, Input, inject, Output } from '@angular/core';
import { ServiceService } from '../../../../../services/service.service';

@Component({
  selector: 'app-delete-modals-services',
  imports: [],
  templateUrl: './delete-modals-services.component.html',
  styleUrl: './delete-modals-services.component.css',
})
export class DeleteModalsServicesComponent {
  private serviceService = inject(ServiceService);

  @Input() serviceId?: number;
  @Output() close = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<number>();

  constructor() {}

  confirm() {
    if (this.serviceId != null) {
      this.serviceService.deleteService(this.serviceId);
      this.confirmDelete.emit(this.serviceId);
    }
    this.close.emit();
  }

  cancel() {
    this.close.emit();
  }
}
