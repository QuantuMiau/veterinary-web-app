import { Component, EventEmitter, inject, Output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {PatientService} from '../../../../../../services/patient-service';

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

  constructor(
    private patientService: PatientService
  ) {}



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
    this.patientService.addPatient({
      id: Date.now(),
      name: this.patientForm.value.name!,
      species: this.patientForm.value.species!,
      breed: this.patientForm.value.breed ?? '',
      sex: this.patientForm.value.sex!,
      owner: this.patientForm.value.owner!

    });

    this.patientForm.reset();
    this.close.emit();
  }

}
