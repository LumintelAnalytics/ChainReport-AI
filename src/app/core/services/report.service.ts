<<<<<<< HEAD
import { Injectable, OnDestroy } from '@angular/core';
=======
import { Injectable } from '@angular/core';
>>>>>>> c620bf2 (feat: Implement ReportService for status management)
import { BehaviorSubject, Observable } from 'rxjs';
import { ReportStatus } from '../../models/report-status.enum';

@Injectable({
  providedIn: 'root'
})
<<<<<<< HEAD
export class ReportService implements OnDestroy {
  private generationTimeout: ReturnType<typeof setTimeout> | null = null;
=======
export class ReportService {
>>>>>>> c620bf2 (feat: Implement ReportService for status management)
  private reportStatusSubject: BehaviorSubject<ReportStatus> = new BehaviorSubject<ReportStatus>(ReportStatus.IDLE);
  public reportStatus$: Observable<ReportStatus> = this.reportStatusSubject.asObservable();

  constructor() { }

  startReportGeneration(): void {
<<<<<<< HEAD
    if (this.generationTimeout) {
      clearTimeout(this.generationTimeout);
    }
    this.setStatus(ReportStatus.GENERATING);
    // Simulate report generation process
    this.generationTimeout = setTimeout(() => {
      this.setStatus(ReportStatus.COMPLETED);
      this.generationTimeout = null;
    }, 5000); // Simulate a 5-second generation time
  }

  cancelReportGeneration(): void {
    if (this.generationTimeout) {
      clearTimeout(this.generationTimeout);
      this.generationTimeout = null;
    }
    this.setStatus(ReportStatus.IDLE);
  }

  setStatus(status: ReportStatus): void {
    this.reportStatusSubject.next(status);
  }

  getStatus(): Observable<ReportStatus> {
    return this.reportStatus$;
  }

  ngOnDestroy(): void {
    if (this.generationTimeout) {
      clearTimeout(this.generationTimeout);
      this.generationTimeout = null;
    }
  }
=======
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
>>>>>>> c620bf2 (feat: Implement ReportService for status management)
}