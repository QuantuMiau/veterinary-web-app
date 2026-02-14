import {Component, EventEmitter, inject, Output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ServiceService} from '../../../../../services/service.service';

@Component({
  selector: 'app-add-modals-services',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './add-modals-services.component.html',
  styleUrl: './add-modals-services.component.css',
})
export class AddModalsServicesComponent {
  private fb = inject(FormBuilder);

  constructor(
    private serviceService: ServiceService
  ) {}


  @Output() close = new EventEmitter<void>();

  serviceForm = this.fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(1)]],
    duration: ['', Validators.required],
  });

  submit() {
    if (this.serviceForm.invalid) return;

    this.serviceService.addService({
      id: Date.now(),
      name: this.serviceForm.value.name!,
      category: this.serviceForm.value.category!,
      duration: this.serviceForm.value.duration!,
      price: Number(this.serviceForm.value.price)
    });

    console.log(this.serviceService.getServices());

    this.serviceForm.reset();
    this.close.emit();
  }

}
