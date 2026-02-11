import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientTabsComponent } from './patient-tabs.component';

describe('PatientTabsComponent', () => {
  let component: PatientTabsComponent;
  let fixture: ComponentFixture<PatientTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientTabsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
