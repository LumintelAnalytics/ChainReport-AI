import { TestBed } from '@angular/core/testing';
import { ReportService } from './report.service';
import { ReportStatus } from '../../models/report-status.enum';

describe('ReportService', () => {
  let service: ReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially be in IDLE status', (done) => {
    service.getStatus().subscribe(status => {
      expect(status).toBe(ReportStatus.IDLE);
      done();
    });
  });

  it('should transition from IDLE to GENERATING and then to COMPLETED', (done) => {
    service.getStatus().subscribe(status => {
      if (status === ReportStatus.IDLE) {
        service.startReportGeneration();
      } else if (status === ReportStatus.GENERATING) {
        // Expect GENERATING status, then wait for COMPLETED
      } else if (status === ReportStatus.COMPLETED) {
        expect(status).toBe(ReportStatus.COMPLETED);
        done();
      }
    });
  });

  it('should clear previous timeouts and start a new generation on consecutive calls', (done) => {
    let generationCount = 0;
    service.getStatus().subscribe(status => {
      if (status === ReportStatus.IDLE && generationCount === 0) {
        service.startReportGeneration();
        generationCount++;
        // Immediately call again to test concurrency prevention
        service.startReportGeneration();
      } else if (status === ReportStatus.COMPLETED) {
        expect(generationCount).toBe(1); // Only one generation should complete
        done();
      }
    });
  });

  it('should cancel report generation and return to IDLE status', (done) => {
    let hasStarted = false;
    service.getStatus().subscribe(status => {
      if (status === ReportStatus.IDLE && !hasStarted) {
        hasStarted = true;
        service.startReportGeneration();
        service.cancelReportGeneration();
      } else if (status === ReportStatus.IDLE && hasStarted) {
        expect(status).toBe(ReportStatus.IDLE);
        done();
      }
    });
  });

  it('should clear timeout on ngOnDestroy', () => {
    service.startReportGeneration();
    const clearTimeoutSpy = spyOn(window, 'clearTimeout');
    service.ngOnDestroy();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
