import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionerComponent } from './commissioner.component';

describe('CommissionerComponent', () => {
  let component: CommissionerComponent;
  let fixture: ComponentFixture<CommissionerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommissionerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommissionerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
