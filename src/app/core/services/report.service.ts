import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, interval, Subscription } from 'rxjs';
import { catchError, tap, switchMap, takeWhile } from 'rxjs/operators';
import { ReportStatus } from '../../models/report-status.enum';

interface GenerateReportRequest {
  tokenIdentifier: string;
}

interface GenerateReportResponse {
  reportId: string;
  status: string; // e.g., 'PENDING', 'ERROR'
  message?: string; // Optional message for errors or status updates
}

@Injectable({
  providedIn: 'root'
})
export class ReportService implements OnDestroy {
  private reportStatusSubject: BehaviorSubject<ReportStatus> = new BehaviorSubject<ReportStatus>(ReportStatus.IDLE);
  public reportStatus$: Observable<ReportStatus> = this.reportStatusSubject.asObservable();
  private pollingSubscription: Subscription | undefined;

  constructor(private http: HttpClient) { }

  generateReport(token: string): Observable<GenerateReportResponse> {
    this.setStatus(ReportStatus.GENERATING);
    const requestBody: GenerateReportRequest = { tokenIdentifier: token };
    return this.http.post<GenerateReportResponse>('/api/v1/report/generate', requestBody)
      .pipe(
        tap(response => {
          if (response.status === 'PENDING') {
            console.log(`Report generation initiated with ID: ${response.reportId}`);
            this.pollingSubscription = this.pollReportStatus(response.reportId).subscribe();
          } else if (response.status === 'ERROR') {
            console.error(`Error initiating report generation: ${response.message}`);
            this.setStatus(ReportStatus.ERROR);
          }
        }),
        catchError(error => {
          console.error('HTTP error during report generation:', error);
          this.setStatus(ReportStatus.ERROR);
          return throwError(() => new Error('Failed to generate report'));
        })
      );
  }

  pollReportStatus(reportId: string): Observable<any> {
    return interval(5000).pipe(
      switchMap(() => this.http.get<GenerateReportResponse>(`/api/v1/report/status/${reportId}`)),
      tap(response => {
        if (response.status === 'SUCCESS') {
          this.setStatus(ReportStatus.SUCCESS);
          console.log(`Report ${reportId} completed successfully.`);
        } else if (response.status === 'ERROR') {
          this.setStatus(ReportStatus.ERROR);
          console.error(`Report ${reportId} failed: ${response.message}`);
        } else {
          this.setStatus(ReportStatus.GENERATING); // Still pending or processing
        }
      }),
      takeWhile(response => response.status !== 'SUCCESS' && response.status !== 'ERROR', true),
      catchError(error => {
        console.error(`HTTP error during polling for report ${reportId}:`, error);
        this.setStatus(ReportStatus.ERROR);
        return throwError(() => new Error(`Failed to poll report status for ${reportId}`));
      })
    );
  }

  setStatus(status: ReportStatus): void {
    this.reportStatusSubject.next(status);
  }

  getStatus(): Observable<ReportStatus> {
    return this.reportStatus$;
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}
