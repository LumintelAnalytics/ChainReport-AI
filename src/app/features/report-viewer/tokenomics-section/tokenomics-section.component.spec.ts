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
    component.tokenomicsReport = {
      supplyInfo: {
        circulatingSupply: '1000000',
        totalSupply: '1000000',
      },
      distributionInfo: {
        holdersCount: 1000,
        topHoldersPercentage: 0.5,
      },
      riskFlags: {
        isCentralized: false,
        hasMintFunction: false,
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
