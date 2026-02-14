import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IotComponent } from './iot.component';
//import { ClientesComponent } from './iot.component';

describe('IotComponent', () => {
  let component: IotComponent;
  let fixture: ComponentFixture<IotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IotComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
