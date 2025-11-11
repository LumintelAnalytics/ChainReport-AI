import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReportStatus } from '../../models/report-status.enum';
import { getReportStatusLabel } from '../../models/report-status-label.helper';
import { ReportService, ReportError } from '../../services/report.service';
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
  @Input() reportStatus: ReportStatus = ReportStatus.IDLE;
  public ReportStatus = ReportStatus; // Make enum available in template
  errorMessage: string | null = null;

  private reportIdSubscription: Subscription | undefined;
  private errorSubscription: Subscription | undefined;

  constructor(private reportService: ReportService, private router: Router) { }

  ngOnInit(): void {
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
  }

  getReportStatusLabel(status: ReportStatus): string {
    return getReportStatusLabel(status);
  }
}
