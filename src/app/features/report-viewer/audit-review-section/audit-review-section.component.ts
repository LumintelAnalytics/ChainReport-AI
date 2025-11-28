import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ChainReport } from '../../../../models/chain-report.model';

@Component({
  selector: 'app-audit-review-section',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './audit-review-section.component.html',
  styleUrl: './audit-review-section.component.scss'
})
export class AuditReviewSectionComponent {
  @Input() chainReport!: ChainReport;
}
