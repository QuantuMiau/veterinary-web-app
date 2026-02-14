import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModalsServicesComponent } from './edit-modals-services.component';

describe('EditModalsServicesComponent', () => {
  let component: EditModalsServicesComponent;
  let fixture: ComponentFixture<EditModalsServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditModalsServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditModalsServicesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
