import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalSummaryComponent } from './final-summary.component';

describe('FinalSummaryComponent', () => {
  let component: FinalSummaryComponent;
  let fixture: ComponentFixture<FinalSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
