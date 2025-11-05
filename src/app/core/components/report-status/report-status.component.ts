import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ReportStatus } from '../../models/report-status.enum';
import { getReportStatusLabel } from '../../models/report-status-label.helper';
import { ReportService } from '../../core/services/report.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-report-status',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './report-status.component.html',
  styleUrls: ['./report-status.component.scss']
})
export class ReportStatusComponent implements OnInit {
  reportStatus$: Observable<ReportStatus>;
  ReportStatus = ReportStatus; // Make enum available in template

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.reportStatus$ = this.reportService.reportStatus$;
  }

  getReportStatusLabel(status: ReportStatus): string {
    return getReportStatusLabel(status);
  }
}
