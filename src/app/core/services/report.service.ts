import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, interval, Subscription, Subject, timer } from 'rxjs';
import { catchError, tap, switchMap, takeWhile, retry, takeUntil } from 'rxjs/operators';
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
  private activePollingSubscriptions: Map<string, Subscription> = new Map();
  private stopPollingSubjects: Map<string, Subject<void>> = new Map();

  private errorSubject: Subject<ReportError | null> = new Subject<ReportError | null>();
  public reportError$: Observable<ReportError | null> = this.errorSubject.asObservable();

  private progressMessageSubject: Subject<string> = new Subject<string>();
  public progressMessage$: Observable<string> = this.progressMessageSubject.asObservable();

  private reportIdOnSuccessSubject: Subject<string> = new Subject<string>();
  public reportIdOnSuccess$: Observable<string> = this.reportIdOnSuccessSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Handles HTTP errors from API calls, categorizes them, and returns a structured ReportError object.
   * This centralizes error processing, providing user-friendly messages based on HTTP status codes.
   * @param error The HttpErrorResponse object received from an HttpClient call.
   * @returns A ReportError object containing a user-friendly message, status code, and the original error.
   * @throws This method does not throw directly but returns an error object.
   */
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
    const statusCode = (error.error instanceof ErrorEvent || error.status === 0) ? undefined : error.status;
    return { message: errorMessage, statusCode: statusCode, originalError: error };
  }

  /**
   * Initiates the generation of a new report for a given token identifier.
   * It sets the report status to GENERATING, makes an HTTP POST request to the report generation API,
   * and upon successful initiation, starts polling for the report's status.
   * If a reportId is not received or an HTTP error occurs, it updates the status to ERROR and emits a ReportError.
   * @param token The token identifier for which the report needs to be generated.
   * @param isRetry Optional. A boolean indicating if this is a retry attempt. If true, the service state is reset.
   * @returns An Observable that emits the GenerateReportResponse upon successful initiation of report generation.
   * @throws Emits a ReportError through `reportError$` observable if report ID is missing or an HTTP error occurs.
   */
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
            // If a poll for this reportId already exists, clean it up before starting a new one.
            if (this.activePollingSubscriptions.has(response.reportId)) {
              this.cleanupPolling(response.reportId);
            }
            this.activePollingSubscriptions.set(response.reportId, this.pollReportStatus(response.reportId).subscribe());
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

  /**
   * Continuously polls the status of a specific report until it reaches a SUCCESS or ERROR state.
   * It emits status updates and progress messages, and cleans up its subscription once the report is complete or an error occurs.
   * @param reportId The unique identifier of the report to poll.
   * @returns An Observable that emits ReportStatusResponse objects with each status update.
   * @throws Emits a ReportError through `reportError$` observable if an HTTP error occurs during polling or if the backend reports an error status.
   */
  pollReportStatus(reportId: string): Observable<ReportStatusResponse> {
    const stopPolling$ = new Subject<void>();
    this.stopPollingSubjects.set(reportId, stopPolling$);

    return timer(0, 5000).pipe(
      takeUntil(stopPolling$),
      switchMap(() => this.http.get<ReportStatusResponse>(`/api/v1/report/status/${reportId}`)),
      tap(response => {
        if (response.status === 'SUCCESS') {
          this.setStatus(ReportStatus.SUCCESS);
          this.reportIdOnSuccessSubject.next(reportId);
          console.log(`Report ${reportId} completed successfully.`);
          this.cleanupPolling(reportId);
        } else if (response.status === 'ERROR') {
          const error: ReportError = {
            message: response.errorMessage || `Report ${reportId} failed with an unknown error.`,
            statusCode: REPORT_ERROR_STATUS_SENTINEL // Default to 500 for backend-reported errors during polling
          };
          this.setStatus(ReportStatus.ERROR);
          console.error(`Report ${reportId} failed: ${error.message}`);
          this.errorSubject.next(error);
          this.cleanupPolling(reportId);
        } else {
          this.setStatus(ReportStatus.GENERATING); // Still pending or processing
          if (response.progressMessage) {
            this.progressMessageSubject.next(response.progressMessage);
          }
        }
      }),
      takeWhile(response => response.status !== 'SUCCESS' && response.status !== 'ERROR', true),
      catchError((error: HttpErrorResponse) => {
        const reportError = this.handleError(error);
        console.error(`HTTP error during polling for report ${reportId}:`, reportError);
        this.setStatus(ReportStatus.ERROR);
        this.errorSubject.next(reportError);
        this.cleanupPolling(reportId); // Clean up on error as well
        return throwError(() => reportError);
      })
    );
  }

  /**
   * Cleans up and unsubscribes from active polling subscriptions and completes the associated stop subjects.
   * This prevents memory leaks and ensures that polling stops when a report is completed, errors out, or is cancelled.
   * @param reportId The unique identifier of the report for which to clean up polling resources.
   */
  private cleanupPolling(reportId: string): void {
    const stopSubject = this.stopPollingSubjects.get(reportId);
    if (stopSubject) {
      stopSubject.next();
      stopSubject.complete();
      this.stopPollingSubjects.delete(reportId);
    }
    const subscription = this.activePollingSubscriptions.get(reportId);
    if (subscription) {
      subscription.unsubscribe();
      this.activePollingSubscriptions.delete(reportId);
    }
  }

  /**
   * Public method to explicitly cancel the polling for a specific report.
   * This will stop any ongoing status checks and clean up associated resources.
   * @param reportId The unique identifier of the report whose polling should be cancelled.
   */
  cancelPolling(reportId: string): void {
    this.cleanupPolling(reportId);
    console.log(`Polling for report ${reportId} cancelled.`);
  }

  /**
   * Updates the current status of the report generation process.
   * This method is used internally to broadcast status changes to all subscribers of `reportStatus$`.
   * @param status The new ReportStatus to set (e.g., IDLE, GENERATING, SUCCESS, ERROR).
   */
  setStatus(status: ReportStatus): void {
    this.reportStatusSubject.next(status);
  }

  /**
   * Provides an observable that emits the current and subsequent report status changes.
   * Components can subscribe to this to react to changes in the report generation lifecycle.
   * @returns An Observable of ReportStatus, representing the current state of report generation.
   */
  getStatus(): Observable<ReportStatus> {
    return this.reportStatus$;
  }

  /**
   * Cancels all currently active report polling subscriptions.
   * This is typically called during service destruction or when resetting the service state to prevent orphaned subscriptions.
   */
  private cancelAllPolling(): void {
    this.activePollingSubscriptions.forEach((sub, reportId) => this.cleanupPolling(reportId));
  }

  /**
   * Lifecycle hook that is called when the service is destroyed.
   * It ensures all active subscriptions are unsubscribed and subjects are completed to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.activePollingSubscriptions.forEach(sub => sub.unsubscribe());
    this.activePollingSubscriptions.clear();
    this.stopPollingSubjects.forEach(subject => subject.complete());
    this.stopPollingSubjects.clear();
    this.progressMessageSubject.complete();
    this.errorSubject.complete();
    this.reportStatusSubject.complete();
    this.reportIdOnSuccessSubject.complete();
  }

  /**
   * Resets the service to its initial idle state, cancelling all active polling and clearing any previous errors or progress messages.
   * This is useful for preparing the service for a new report generation cycle.
   */
  resetState(): void {
    this.cancelAllPolling();
    this.setStatus(ReportStatus.IDLE);
    this.errorSubject.next(null); // Clear any previous errors
    this.progressMessageSubject.next('');
  }
}
