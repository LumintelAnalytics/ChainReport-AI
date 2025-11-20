import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenomicsSectionComponent } from './tokenomics-section.component';

describe('TokenomicsSectionComponent', () => {
  let component: TokenomicsSectionComponent;
  let fixture: ComponentFixture<TokenomicsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenomicsSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenomicsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
