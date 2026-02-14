import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteModalsServicesComponent } from './delete-modals-services.component';

describe('DeleteModalsServicesComponent', () => {
  let component: DeleteModalsServicesComponent;
  let fixture: ComponentFixture<DeleteModalsServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteModalsServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteModalsServicesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
