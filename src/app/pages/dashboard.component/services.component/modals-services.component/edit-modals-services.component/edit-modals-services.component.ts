import {Component, EventEmitter, inject, Output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-modals-services',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit-modals-services.component.html',
  styleUrl: './edit-modals-services.component.css',
})
export class EditModalsServicesComponent {
  private fb = inject(FormBuilder);


  @Output() close = new EventEmitter<void>();

  serviceForm = this.fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(1)]],
    duration: ['', Validators.required],
  });

  submit() {
    if (this.serviceForm.invalid) return;

    console.log(this.serviceForm.value);
    this.close.emit();
    console.log("se guardo")
  }
}
