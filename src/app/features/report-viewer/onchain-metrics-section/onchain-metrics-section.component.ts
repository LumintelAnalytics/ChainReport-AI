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

const ELEMENT_DATA: OnchainMovement[] = [
  { metric: 'Holder Changes', value: '1,234', change: '+5%' },
  { metric: 'Whale Movements', value: '56', change: '-2%' },
  { metric: 'Large Inflow', value: '12', change: '+10%' },
  { metric: 'Large Outflow', value: '8', change: '-3%' },
];

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
  onchainMovements = ELEMENT_DATA;
}
