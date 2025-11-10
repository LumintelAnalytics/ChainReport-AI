import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ReportStatus } from '../../models/report-status.enum';
import { getReportStatusLabel } from '../../models/report-status-label.helper';
import { ReportService } from '../../core/services/report.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-status',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './report-status.component.html',
  styleUrls: ['./report-status.component.scss']
})
export class ReportStatusComponent implements OnInit, OnDestroy {
  reportStatus$: Observable<ReportStatus>;
  ReportStatus = ReportStatus; // Make enum available in template
  private reportIdSubscription: Subscription | undefined;

  constructor(private reportService: ReportService, private router: Router) { }

  ngOnInit(): void {
    this.reportStatus$ = this.reportService.reportStatus$;
    this.reportIdSubscription = this.reportService.reportIdOnSuccess$.subscribe(reportId => {
      this.router.navigate(['/report', reportId]);
    });
  }

  ngOnDestroy(): void {
    if (this.reportIdSubscription) {
      this.reportIdSubscription.unsubscribe();
    }
  }

  getReportStatusLabel(status: ReportStatus): string {
    return getReportStatusLabel(status);
  }
}
