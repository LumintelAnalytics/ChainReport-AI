import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TokenomicsReport } from '../../../models/tokenomics.model';

@Component({
  selector: 'app-tokenomics-section',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './tokenomics-section.component.html',
  styleUrl: './tokenomics-section.component.scss',
})
export class TokenomicsSectionComponent {
  @Input() tokenomicsReport!: TokenomicsReport;
}
