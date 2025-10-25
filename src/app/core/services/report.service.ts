import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ReportStatus } from '../../models/report-status.enum';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private reportStatusSubject = new BehaviorSubject<ReportStatus>(ReportStatus.Idle);
  reportStatus$: Observable<ReportStatus> = this.reportStatusSubject.asObservable();

  constructor(private http: HttpClient) { }

  generateReport(token: string): Observable<ReportStatus> {
    this.reportStatusSubject.next(ReportStatus.Generating);
    console.log(`Generating report for token: ${token}`);

    // Replace '/api/reports' with the real endpoint and response type
    return this.http.post<any>('/api/reports', { token }).pipe(
      map(() => ReportStatus.Generated),
      tap((status) => {
        this.reportStatusSubject.next(status);
        console.log('Report generated successfully.');
      }),
      catchError((error) => {
        this.reportStatusSubject.next(ReportStatus.Error);
        console.error('Error generating report:', error);
        return of(ReportStatus.Error);
      })
    );
  }

  resetReportStatus(): void {
    this.reportStatusSubject.next(ReportStatus.Idle);
  }
}
