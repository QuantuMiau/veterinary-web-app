import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RxTableComponent } from './rx-table.component';

describe('RxTableComponent', () => {
  let component: RxTableComponent;
  let fixture: ComponentFixture<RxTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RxTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RxTableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
