import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { ReportStatus } from '../../models/report-status.enum';
import { getReportStatusLabel } from '../../models/report-status-label.helper';
import { ReportService, ReportError } from '../../core/services/report.service'; // Import ReportError
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-status',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './report-status.component.html',
  styleUrls: ['./report-status.component.scss']
})
export class ReportStatusComponent implements OnInit, OnDestroy {
  reportStatus$: Observable<ReportStatus>;
  ReportStatus = ReportStatus; // Make enum available in template
  errorMessage: string | null = null;
  showRetryButton: boolean = false;

  @Output() retryReport = new EventEmitter<void>();

  private reportIdSubscription: Subscription | undefined;
  private errorSubscription: Subscription | undefined;
  private statusSubscription: Subscription | undefined;

  constructor(private reportService: ReportService, private router: Router) { }

  ngOnInit(): void {
    this.reportStatus$ = this.reportService.reportStatus$;

    this.statusSubscription = this.reportStatus$.subscribe(status => {
      if (status === ReportStatus.ERROR) {
        this.showRetryButton = true;
      } else {
        this.showRetryButton = false;
        this.errorMessage = null; // Clear error message when status changes from ERROR
      }
    });

    this.reportIdSubscription = this.reportService.reportIdOnSuccess$.subscribe(reportId => {
      this.router.navigate(['/report', reportId]);
    });

    this.errorSubscription = this.reportService.reportError$.subscribe(error => {
      this.errorMessage = error.message;
    });
  }

  ngOnDestroy(): void {
    if (this.reportIdSubscription) {
      this.reportIdSubscription.unsubscribe();
    }
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  onRetry(): void {
    this.retryReport.emit();
    this.errorMessage = null;
    this.showRetryButton = false;
  }

  getReportStatusLabel(status: ReportStatus): string {
    return getReportStatusLabel(status);
  }
}
