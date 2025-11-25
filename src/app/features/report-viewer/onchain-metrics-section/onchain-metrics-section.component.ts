import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ChainReport } from 'src/app/models/chain-report.model';

@Component({
  selector: 'app-onchain-metrics-section',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './onchain-metrics-section.component.html',
  styleUrl: './onchain-metrics-section.component.scss',
})
export class OnchainMetricsSectionComponent {
  @Input() chainReport: ChainReport | undefined;
}
