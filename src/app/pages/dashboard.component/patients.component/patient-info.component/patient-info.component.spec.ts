import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientInfoComponent } from './patient-info.component';

describe('PatientInfoComponent', () => {
  let component: PatientInfoComponent;
  let fixture: ComponentFixture<PatientInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientInfoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
