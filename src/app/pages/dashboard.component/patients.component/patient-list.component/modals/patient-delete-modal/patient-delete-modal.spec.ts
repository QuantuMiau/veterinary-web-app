import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDeleteModal } from './patient-delete-modal';

describe('PatientDeleteModal', () => {
  let component: PatientDeleteModal;
  let fixture: ComponentFixture<PatientDeleteModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientDeleteModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientDeleteModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
