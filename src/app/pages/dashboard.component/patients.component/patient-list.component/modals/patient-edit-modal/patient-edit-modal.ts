import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient } from '../../../../../../services/patient-service';

@Component({
  selector: 'app-patient-edit-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './patient-edit-modal.html'
})
export class PatientEditModal implements OnChanges {

  private fb = inject(FormBuilder);

  @Input() patient!: Patient;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Patient>();

  patientEditForm = this.fb.group({
    name: ['', Validators.required],
    species: ['', Validators.required],
    breed: [''],
    sex: ['', Validators.required],
    owner: ['', Validators.required]
  });

// importante
  ngOnChanges(changes: SimpleChanges) {
    if (changes['patient'] && this.patient) {
      this.patientEditForm.patchValue({
        name: this.patient.name,
        species: this.patient.species,
        breed: this.patient.breed,
        sex: this.patient.sex,
        owner: this.patient.owner
      });
    }
  }

  submit() {
    if (this.patientEditForm.invalid) return;

    this.save.emit({
      id: this.patient.id,
      name: this.patientEditForm.value.name!,
      species: this.patientEditForm.value.species!,
      breed: this.patientEditForm.value.breed ?? '',
      sex: this.patientEditForm.value.sex!,
      owner: this.patientEditForm.value.owner!
    });

    this.patientEditForm.reset();
  }
}
