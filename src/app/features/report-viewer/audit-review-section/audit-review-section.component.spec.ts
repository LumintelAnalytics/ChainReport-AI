import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditReviewSectionComponent } from './audit-review-section.component';

describe('AuditReviewSectionComponent', () => {
  let component: AuditReviewSectionComponent;
  let fixture: ComponentFixture<AuditReviewSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditReviewSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditReviewSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
