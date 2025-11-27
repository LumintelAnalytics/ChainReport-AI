import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeReviewSectionComponent } from './code-review-section.component';

describe('CodeReviewSectionComponent', () => {
  let component: CodeReviewSectionComponent;
  let fixture: ComponentFixture<CodeReviewSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeReviewSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeReviewSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
