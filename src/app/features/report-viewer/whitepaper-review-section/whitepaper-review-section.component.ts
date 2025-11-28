import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChainReport } from '../../../models/chain-report.model';

@Component({
  selector: 'app-whitepaper-review-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whitepaper-review-section.component.html',
  styleUrl: './whitepaper-review-section.component.scss',
})
export class WhitepaperReviewSectionComponent {
  @Input() report?: ChainReport;
}
