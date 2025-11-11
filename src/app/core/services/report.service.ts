import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, interval, Subscription, Subject } from 'rxjs';
import { catchError, tap, switchMap, takeWhile, retry } from 'rxjs/operators';
import { ReportStatus } from '../../models/report-status.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { GenerateReportResponse, ReportStatusResponse } from '../../models/report-api.models';

export const REPORT_ERROR_STATUS_SENTINEL = 500;

export interface ReportError {
  message: string;
  statusCode?: number;
  originalError?: any;
}

interface GenerateReportRequest {
  tokenIdentifier: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService implements OnDestroy {
  private reportStatusSubject: BehaviorSubject<ReportStatus> = new BehaviorSubject<ReportStatus>(ReportStatus.IDLE);
  public reportStatus$: Observable<ReportStatus> = this.reportStatusSubject.asObservable();
  private pollingSubscription: Subscription | undefined;

  private errorSubject: Subject<ReportError> = new Subject<ReportError>();
  public reportError$: Observable<ReportError> = this.errorSubject.asObservable();

  private reportIdOnSuccessSubject: Subject<string> = new Subject<string>();
  public reportIdOnSuccess$: Observable<string> = this.reportIdOnSuccessSubject.asObservable();

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse): ReportError {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `A client-side error occurred: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid token identifier. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized: Please log in again.';
          break;
        case 404:
          errorMessage = 'The requested report or API endpoint was not found.';
          break;
        case 500:
          errorMessage = 'A server error occurred. Please try again later.';
          break;
        default:
          errorMessage = `An unexpected error occurred. Status: ${error.status}`;
      }
    }
    const statusCode = (error.error instanceof ErrorEvent || error.status === 0 || error.status === REPORT_ERROR_STATUS_SENTINEL) ? undefined : error.status;
    return { message: errorMessage, statusCode: statusCode, originalError: error };
  }

  generateReport(token: string, isRetry: boolean = false): Observable<GenerateReportResponse> {
    if (isRetry) {
      this.resetState();
    }
    this.setStatus(ReportStatus.GENERATING);
    const requestBody: GenerateReportRequest = { tokenIdentifier: token };
    return this.http.post<GenerateReportResponse>('/api/v1/report/generate', requestBody)
      .pipe(
        retry(2), // Retry the request up to 2 times
        tap(response => {
          if (response.reportId) {
            console.log(`Report generation initiated with ID: ${response.reportId}`);
            this.pollingSubscription = this.pollReportStatus(response.reportId).subscribe();
          } else {
            const error: ReportError = {
              message: 'Report ID not received during generation initiation.',
              statusCode: REPORT_ERROR_STATUS_SENTINEL
            };
            console.error(`Error initiating report generation: ${error.message}`);
            this.setStatus(ReportStatus.ERROR);
            this.errorSubject.next(error);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          const reportError = this.handleError(error);
          console.error('HTTP error during report generation:', reportError);
          this.setStatus(ReportStatus.ERROR);
          this.errorSubject.next(reportError);
          return throwError(() => reportError);
        })
      );
  }

  pollReportStatus(reportId: string): Observable<ReportStatusResponse> {
    return interval(5000).pipe(
      switchMap(() => this.http.get<ReportStatusResponse>(`/api/v1/report/status/${reportId}`)),
      tap(response => {
        if (response.status === 'SUCCESS') {
          this.setStatus(ReportStatus.SUCCESS);
          this.reportIdOnSuccessSubject.next(reportId);
          console.log(`Report ${reportId} completed successfully.`);
        } else if (response.status === 'ERROR') {
          const error: ReportError = {
            message: response.errorMessage || `Report ${reportId} failed with an unknown error.`,
            statusCode: REPORT_ERROR_STATUS_SENTINEL // Default to 500 for backend-reported errors during polling
          };
          this.setStatus(ReportStatus.ERROR);
          console.error(`Report ${reportId} failed: ${error.message}`);
          this.errorSubject.next(error);
        } else {
          this.setStatus(ReportStatus.GENERATING); // Still pending or processing
        }
      }),
      takeWhile(response => response.status !== 'SUCCESS' && response.status !== 'ERROR', true),
      catchError((error: HttpErrorResponse) => {
        const reportError = this.handleError(error);
        console.error(`HTTP error during polling for report ${reportId}:`, reportError);
        this.setStatus(ReportStatus.ERROR);
        this.errorSubject.next(reportError);
        return throwError(() => reportError);
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

  resetState(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = undefined;
    }
    this.setStatus(ReportStatus.IDLE);
    this.errorSubject.next(null as any); // Clear any previous errors
  }
}
