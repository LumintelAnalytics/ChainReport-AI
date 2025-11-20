import { Component, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReportService } from '../../core/services/report.service';

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
  reportData: any = null;
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
              this.error = err?.message || 'Failed to load report.';
              this.reportData = null;
              return of(null);
            }),
            finalize(() => {
              this.isLoading = false;
            })
          );
        }
        return of(null);
      })
    ).subscribe(report => {
      if (report) {
        this.reportData = report;
      }
    });
  }
}
