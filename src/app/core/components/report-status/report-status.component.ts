import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Import MatProgressSpinnerModule
import { ReportStatus } from '../../models/report-status.enum';
import { getReportStatusLabel } from '../../models/report-status-label.helper';
import { ReportService, ReportError } from '../../services/report.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-status',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule], // Add MatProgressSpinnerModule
  templateUrl: './report-status.component.html',
  styleUrls: ['./report-status.component.scss']
})
export class ReportStatusComponent implements OnInit, OnDestroy {
  public currentReportStatus: ReportStatus = ReportStatus.IDLE;
  public ReportStatus = ReportStatus; // Make enum available in template

  errorMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private reportService: ReportService, private router: Router) { }

  ngOnInit(): void {
    this.reportService.reportStatus$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (status) => {
        this.currentReportStatus = status;
      },
      error: (err) => console.error('Error in reportStatus$ subscription:', err)
    });

    this.reportService.reportIdOnSuccess$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (reportId) => {
        if (reportId) {
          this.router.navigate(['/report', reportId]);
        }
      },
      error: (err) => console.error('Error in reportIdOnSuccess$ subscription:', err)
    });

    this.reportService.reportError$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (error) => {
        this.errorMessage = error?.message || 'An unexpected error occurred.';
      },
      error: (err) => console.error('Error in reportError$ subscription:', err)
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getReportStatusLabel(status: ReportStatus): string {
    return getReportStatusLabel(status);
  }
}
