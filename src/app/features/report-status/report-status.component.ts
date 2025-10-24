import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export enum ReportState {
  Initial = 'Initial',
  CollectingOnchainData = 'Collecting Onchain Data...',
  AnalyzingSentiment = 'Analyzing Sentiment...',
  ReportSynthesisComplete = 'Report Synthesis Complete',
  ErrorOccurred = 'Error Occurred',
}

@Component({
  selector: 'app-report-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-status.component.html',
  styleUrls: ['./report-status.component.scss'],
})
export class ReportStatusComponent {
  @Input() currentStatus: ReportState = ReportState.Initial;

  get statusMessage(): string {
    switch (this.currentStatus) {
      case ReportState.Initial:
        return 'Initial';
      case ReportState.CollectingOnchainData:
        return 'Collecting Onchain Data...';
      case ReportState.AnalyzingSentiment:
        return 'Analyzing Sentiment...';
      case ReportState.ReportSynthesisComplete:
        return 'Report Synthesis Complete';
      case ReportState.ErrorOccurred:
        return 'Error Occurred';
      default:
        return 'Unknown Status';
    }
  }
}
