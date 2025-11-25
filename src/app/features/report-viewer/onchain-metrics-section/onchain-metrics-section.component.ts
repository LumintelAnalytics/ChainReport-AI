import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table'; // Import MatTableModule
import { ChainReport } from 'src/app/models/chain-report.model';

export interface OnchainMovement {
  metric: string;
  value: string;
  change: string;
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

  displayedColumns: string[] = ['metric', 'value', 'change'];
get onchainMovements(): OnchainMovement[] {
  if (!this.chainReport) return [];

  const movements: OnchainMovement[] = [];

  // Holder Changes
  if (this.chainReport.holderActivity) {
    movements.push({
      metric: 'Holder Changes',
      value: this.chainReport.holderActivity.totalHolders?.toLocaleString() || '0',
      change: 'N/A' // Placeholder, requires historical data for calculation
    });
  }

  // Whale Movements
  if (this.chainReport.whaleMovements) {
    movements.push({
      metric: 'Whale Movements',
      value: this.chainReport.whaleMovements.whaleTransactionsCount?.toLocaleString() || '0',
      change: 'N/A' // Placeholder, requires historical data for calculation
    });
  }

  return movements;
}
}
