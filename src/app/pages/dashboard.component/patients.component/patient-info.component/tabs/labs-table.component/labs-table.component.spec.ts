import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabsTableComponent } from './labs-table.component';

describe('LabsTableComponent', () => {
  let component: LabsTableComponent;
  let fixture: ComponentFixture<LabsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabsTableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
