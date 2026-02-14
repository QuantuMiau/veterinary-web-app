import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Service, ServiceService } from '../../../../../services/service.service';

@Component({
  selector: 'app-edit-modals-services',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-modals-services.component.html',
  styleUrl: './edit-modals-services.component.css',
})
export class EditModalsServicesComponent implements OnChanges {
  private fb = inject(FormBuilder);
  private serviceService = inject(ServiceService);

  @Input() service?: Service;
  @Output() close = new EventEmitter<void>();

  serviceForm = this.fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(1)]],
    duration: ['', Validators.required],
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['service'] && this.service) {
      this.serviceForm.patchValue({
        name: this.service.name,
        category: this.service.category,
        price: this.service.price?.toString(),
        duration: this.service.duration,
      });
    }
  }

  submit() {
    if (this.serviceForm.invalid || !this.service) return;

    const updated: Service = {
      id: this.service.id,
      name: this.serviceForm.value.name!,
      category: this.serviceForm.value.category!,
      price: Number(this.serviceForm.value.price),
      duration: this.serviceForm.value.duration!,
    };

    this.serviceService.updateService(updated);
    console.log('servicio actualizado', updated);
    this.close.emit();
  }
}
