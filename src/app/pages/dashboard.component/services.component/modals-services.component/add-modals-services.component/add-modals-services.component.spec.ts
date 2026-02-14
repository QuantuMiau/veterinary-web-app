import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModalsServicesComponent } from './add-modals-services.component';

describe('AddModalsServicesComponent', () => {
  let component: AddModalsServicesComponent;
  let fixture: ComponentFixture<AddModalsServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddModalsServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddModalsServicesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
