import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, interval } from 'rxjs';
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

  constructor(private http: HttpClient) { }

  generateReport(token: string): Observable<GenerateReportResponse> {
    this.setStatus(ReportStatus.GENERATING);
    const requestBody: GenerateReportRequest = { tokenIdentifier: token };
    return this.http.post<GenerateReportResponse>('/api/v1/report/generate', requestBody)
      .pipe(
        tap(response => {
          if (response.status === 'PENDING') {
            console.log(`Report generation initiated with ID: ${response.reportId}`);
            // Potentially start polling for report status here
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

  setStatus(status: ReportStatus): void {
    this.reportStatusSubject.next(status);
  }

  getStatus(): Observable<ReportStatus> {
    return this.reportStatus$;
  }

  ngOnDestroy(): void {
    // No specific cleanup needed for HTTP client, but keeping the method for consistency
  }
}
