import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinalReportData } from '../../../models/report-api.models';
import { DisclaimerComponent } from '../../../shared/components/disclaimer/disclaimer.component';

@Component({
  selector: 'app-final-summary',
  standalone: true,
  imports: [CommonModule, DisclaimerComponent],
  templateUrl: './final-summary.component.html',
  styleUrl: './final-summary.component.scss'
})
export class FinalSummaryComponent {
  @Input() reportData: FinalReportData | null = null;
  @Input() summaryText: string = '';
  @Input() importantFindings: string[] = [];
}
