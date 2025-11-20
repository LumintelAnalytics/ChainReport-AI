import { Component, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReportService } from '../../core/services/report.service';
import { FinalReportData } from '../../models/report-api.models';

@Component({
  selector: 'app-report-view',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.scss']
})
export class ReportViewComponent implements OnInit {
  reportId: string | null = null;
  isLoading = false;
  reportData: FinalReportData | null = null;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private destroyRef: DestroyRef, private reportService: ReportService) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(params => {
        this.reportId = params.get('reportId');
        if (this.reportId) {
          this.isLoading = true;
          this.error = null;
          return this.reportService.getFinalReport(this.reportId).pipe(
            catchError(err => {
              console.error('Error loading report:', err);
              this.error = 'Failed to load report.';
              this.reportData = null;
              return of(null);
            }),
            finalize(() => {
              this.isLoading = false;
            })
          );
        } else {
          this.reportData = null;
          this.error = 'Report ID is missing.';
          return of(null);
        }
      })
    ).subscribe(report => {
      if (report) {
        this.reportData = report;
      }
    });
  }
}
