import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnchainMetricsSectionComponent, OnchainMovement } from './onchain-metrics-section.component';
import { ChainReport } from 'src/app/models/chain-report.model';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

describe('OnchainMetricsSectionComponent', () => {
  let component: OnchainMetricsSectionComponent;
  let fixture: ComponentFixture<OnchainMetricsSectionComponent>;

  const mockChainReport: ChainReport = {
    reportId: '123',
    tokenId: 'token1',
    reportDate: '2023-01-01',
    onchainMetrics: {
      transactionsCount: 1000,
      activeAddresses: 500,
      newAddresses: 100,
      transactionVolume: 1000000,
      averageTransactionValue: 1000,
      largeTransactions: 50, // Added for testing
    },
    holderActivity: {
      totalHolders: 10000,
      hodlWaves: { '1y-2y': 1000 },
      concentrationByBalance: { '<1k': 0.2 },
    },
    whaleMovements: {
      whaleTransactionsCount: 10,
      whaleTransactionVolume: '100000',
      topHolders: [],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, MatCardModule, MatTableModule, OnchainMetricsSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OnchainMetricsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return empty onchainMovements when chainReport is undefined', () => {
    component.chainReport = undefined;
    expect(component.onchainMovements).toEqual([]);
  });

  it('should correctly populate onchainMovements when chainReport is provided', () => {
    component.chainReport = mockChainReport;
    const expectedMovements: OnchainMovement[] = [
      {
        metric: 'Total Holders',
        value: '10,000',
      },
      {
        metric: 'Whale Movements',
        value: '10',
      },
      {
        metric: 'Large Transactions',
        value: '50',
      },
    ];
    expect(component.onchainMovements).toEqual(expectedMovements);
  });

  it('should have displayedColumns with only metric and value', () => {
    expect(component.displayedColumns).toEqual(['metric', 'value']);
  });

  it('should handle null or undefined values gracefully in onchainMovements', () => {
    const partialChainReport: ChainReport = {
      ...mockChainReport,
      holderActivity: { ...mockChainReport.holderActivity, totalHolders: undefined as any },
      whaleMovements: { ...mockChainReport.whaleMovements, whaleTransactionsCount: undefined as any },
      onchainMetrics: { ...mockChainReport.onchainMetrics, largeTransactions: undefined as any },
    };
    component.chainReport = partialChainReport;
    const expectedMovements: OnchainMovement[] = [
      {
        metric: 'Total Holders',
        value: '0',
      },
      {
        metric: 'Whale Movements',
        value: '0',
      },
      {
        metric: 'Large Transactions',
        value: '0',
      },
    ];
    expect(component.onchainMovements).toEqual(expectedMovements);
  });
});
