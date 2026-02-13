import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientEditModal } from './patient-edit-modal';

describe('PatientEditModal', () => {
  let component: PatientEditModal;
  let fixture: ComponentFixture<PatientEditModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientEditModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientEditModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
