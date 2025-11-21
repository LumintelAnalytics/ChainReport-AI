import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentTeamSectionComponent } from './sentiment-team-section.component';

describe('SentimentTeamSectionComponent', () => {
  let component: SentimentTeamSectionComponent;
  let fixture: ComponentFixture<SentimentTeamSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SentimentTeamSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentimentTeamSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
