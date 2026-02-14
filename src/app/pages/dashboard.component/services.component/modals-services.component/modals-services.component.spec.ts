import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalsServicesComponent } from './modals-services.component';

describe('ModalsServicesComponent', () => {
  let component: ModalsServicesComponent;
  let fixture: ComponentFixture<ModalsServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalsServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalsServicesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
