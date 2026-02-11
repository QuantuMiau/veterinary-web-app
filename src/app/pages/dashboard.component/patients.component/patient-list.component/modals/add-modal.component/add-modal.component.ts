import { Component, EventEmitter, inject, Output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-patient-add-modal',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './add-modal.component.html',
  styleUrl: './add-modal.component.css',
})
export class AddModalComponent {
  private fb = inject(FormBuilder);


  @Output() close = new EventEmitter<void>();

  patientForm = this.fb.group({
    name: ['', Validators.required],
    species: ['', Validators.required],
    breed: [''],
    sex: ['', Validators.required],
    owner: ['', Validators.required]
  });


  submit() {
    if (this.patientForm.invalid) return;

    console.log(this.patientForm.value);
    this.close.emit();
  }

}
