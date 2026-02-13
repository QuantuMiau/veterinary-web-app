import { Component, EventEmitter, inject, Output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-patient-edit-modal',
  imports: [
      ReactiveFormsModule
  ],
  templateUrl: './patient-edit-modal.html',
  styleUrl: './patient-edit-modal.css',
})
export class PatientEditModal {
  private fb = inject(FormBuilder);


  @Output() close = new EventEmitter<void>();

  patientEditForm = this.fb.group({
    name: ['', Validators.required],
    species: ['', Validators.required],
    breed: [''],
    sex: ['', Validators.required],
    owner: ['', Validators.required]
  });


  submit() {
    if (this.patientEditForm.invalid) return;

    console.log(this.patientEditForm.value);
    this.close.emit();
  }

}
