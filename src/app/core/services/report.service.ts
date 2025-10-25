import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReportStatus } from '../../models/report-status.enum';

@Injectable({
  providedIn: 'root'
})
export class ReportService implements OnDestroy {
  private generationTimeout: ReturnType<typeof setTimeout> | null = null;
  private reportStatusSubject: BehaviorSubject<ReportStatus> = new BehaviorSubject<ReportStatus>(ReportStatus.IDLE);
  public reportStatus$: Observable<ReportStatus> = this.reportStatusSubject.asObservable();

  constructor() { }

  startReportGeneration(): void {
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
}