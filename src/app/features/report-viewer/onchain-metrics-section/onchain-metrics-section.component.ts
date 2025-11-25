import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table'; // Import MatTableModule
import { ChainReport } from 'src/app/models/chain-report.model';

export interface OnchainMovement {
  metric: string;
  value: string;
  change?: string;
}



@Component({
  selector: 'app-onchain-metrics-section',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule], // Add MatTableModule here
  templateUrl: './onchain-metrics-section.component.html',
  styleUrl: './onchain-metrics-section.component.scss',
})
export class OnchainMetricsSectionComponent {
  @Input() chainReport: ChainReport | undefined;

  displayedColumns: string[] = ['metric', 'value'];
get onchainMovements(): OnchainMovement[] {
  if (!this.chainReport) return [];

  const movements: OnchainMovement[] = [];

  // TODO: Implement computeChange(currentValue, previousValue) when historical data is available.
  // This will involve fetching and comparing current and historical 24h values, 
  // computing the percentage and signed delta, and formatting it with appropriate +/- and color classes.
  // A tracking issue should be created to document the missing historical data and the planned computeChange implementation.

  // Total Holders
  if (this.chainReport.holderActivity) {
    movements.push({
      metric: 'Total Holders',
      value: this.chainReport.holderActivity.totalHolders?.toLocaleString() || '0',
    });
  }

  // Whale Movements
  if (this.chainReport.whaleMovements) {
    movements.push({
      metric: 'Whale Movements',
      value: this.chainReport.whaleMovements.whaleTransactionsCount?.toLocaleString() || '0',
    });
  }

  // Large Transactions
  if (this.chainReport.onchainMetrics.largeTransactions) {
    movements.push({
      metric: 'Large Transactions',
      value: this.chainReport.onchainMetrics.largeTransactions?.toLocaleString() || '0',
    });
  }

  return movements;
}
}
