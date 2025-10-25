import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { ReportStatus } from '../../models/report-status.enum';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private reportStatusSubject = new BehaviorSubject<ReportStatus>(ReportStatus.Idle);
  reportStatus$: Observable<ReportStatus> = this.reportStatusSubject.asObservable();

  constructor() { }

  generateReport(token: string): Observable<ReportStatus> {
    this.reportStatusSubject.next(ReportStatus.Generating);
    console.log(`Generating report for token: ${token}`);

    // Simulate API call
    return of(ReportStatus.Generated).pipe(
      delay(3000), // Simulate network delay
      tap(() => {
        this.reportStatusSubject.next(ReportStatus.Generated);
        console.log('Report generated successfully.');
      })
    );
  }

  resetReportStatus(): void {
    this.reportStatusSubject.next(ReportStatus.Idle);
  }
}
