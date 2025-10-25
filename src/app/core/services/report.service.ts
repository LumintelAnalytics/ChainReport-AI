import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReportStatus } from '../../models/report-status.enum';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private reportStatusSubject: BehaviorSubject<ReportStatus> = new BehaviorSubject<ReportStatus>(ReportStatus.IDLE);
  public reportStatus$: Observable<ReportStatus> = this.reportStatusSubject.asObservable();

  constructor() { }

  startReportGeneration(): void {
    this.setStatus(ReportStatus.GENERATING);
    // Simulate report generation process
    setTimeout(() => {
      this.setStatus(ReportStatus.COMPLETED);
    }, 5000); // Simulate a 5-second generation time
  }

  setStatus(status: ReportStatus): void {
    this.reportStatusSubject.next(status);
  }

  getStatus(): Observable<ReportStatus> {
    return this.reportStatus$;
  }
}