import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReportService } from './report.service';
import { ReportStatus } from '../../models/report-status.enum';

describe('ReportService', () => {
  let service: ReportService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportService]
    });
    service = TestBed.inject(ReportService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
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

  it('should send a POST request to generate a report', (done) => {
    const testToken = 'test-token-123';
    const mockResponse = { reportId: 'report-456', status: 'PENDING' };

    service.generateReport(testToken).subscribe(response => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpTestingController.expectOne('/api/v1/report/generate');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ tokenIdentifier: testToken });

    req.flush(mockResponse);
  });

  it('should set status to GENERATING when generateReport is called', (done) => {
    const testToken = 'test-token-123';
    const mockResponse = { reportId: 'report-456', status: 'PENDING' };

    service.getStatus().subscribe(status => {
      if (status === ReportStatus.GENERATING) {
        expect(status).toBe(ReportStatus.GENERATING);
        done();
      }
    });

    service.generateReport(testToken).subscribe();
    const req = httpTestingController.expectOne('/api/v1/report/generate');
    req.flush(mockResponse);
  });

  it('should set status to ERROR on HTTP error', (done) => {
    const testToken = 'test-token-123';
    const errorMessage = 'deliberate 404 error';

    service.getStatus().subscribe(status => {
      if (status === ReportStatus.ERROR) {
        expect(status).toBe(ReportStatus.ERROR);
        done();
      }
    });

    service.generateReport(testToken).subscribe({
      error: (error) => {
        expect(error.message).toContain('Failed to generate report');
      }
    });

    const req = httpTestingController.expectOne('/api/v1/report/generate');
    req.error(new ProgressEvent('error'), { status: 404, statusText: 'Not Found' });
  });

  it('should emit a ReportError on HTTP error during generateReport', (done) => {
    const testToken = 'test-token-123';
    const errorMessage = 'deliberate 400 error';

    service.reportError$.subscribe(error => {
      expect(error.message).toBe('Invalid token identifier. Please check your input.');
      expect(error.statusCode).toBe(400);
      done();
    });

    service.generateReport(testToken).subscribe({
      error: () => { }
    });

    const req = httpTestingController.expectOne('/api/v1/report/generate');
    req.error(new ProgressEvent('error'), { status: 400, statusText: 'Bad Request' });
  });

  it('should emit a ReportError when backend returns ERROR status during generateReport', (done) => {
    const testToken = 'test-token-123';
    const mockErrorResponse = { reportId: '', status: 'ERROR', message: 'Invalid token provided.' };

    service.reportError$.subscribe(error => {
      expect(error.message).toBe('Invalid token provided.');
      done();
    });

    service.generateReport(testToken).subscribe();

    const req = httpTestingController.expectOne('/api/v1/report/generate');
    req.flush(mockErrorResponse);
  });

  it('should emit a ReportError on HTTP error during pollReportStatus', (done) => {
    const reportId = 'report-456';
    const mockGenerateResponse = { reportId: reportId, status: 'PENDING' };

    service.generateReport('test-token').subscribe();
    httpTestingController.expectOne('/api/v1/report/generate').flush(mockGenerateResponse);

    service.reportError$.subscribe(error => {
      expect(error.message).toBe('A server error occurred. Please try again later.');
      expect(error.statusCode).toBe(500);
      done();
    });

    const req = httpTestingController.expectOne(`/api/v1/report/status/${reportId}`);
    req.error(new ProgressEvent('error'), { status: 500, statusText: 'Internal Server Error' });
  });

  it('should emit a ReportError when backend returns ERROR status during pollReportStatus', (done) => {
    const reportId = 'report-456';
    const mockGenerateResponse = { reportId: reportId, status: 'PENDING' };
    const mockPollErrorResponse = { reportId: reportId, status: 'ERROR', message: 'Report processing failed.' };

    service.generateReport('test-token').subscribe();
    httpTestingController.expectOne('/api/v1/report/generate').flush(mockGenerateResponse);

    service.reportError$.subscribe(error => {
      expect(error.message).toBe('Report processing failed.');
      done();
    });

    const req = httpTestingController.expectOne(`/api/v1/report/status/${reportId}`);
    req.flush(mockPollErrorResponse);
  });

  it('should not clear timeout on ngOnDestroy', () => {
    const clearTimeoutSpy = spyOn(window, 'clearTimeout');
    service.ngOnDestroy();
    expect(clearTimeoutSpy).not.toHaveBeenCalled();
  });

  it('should emit reportIdOnSuccess$ when report status becomes SUCCESS', (done) => {
    const testToken = 'test-token-123';
    const reportId = 'report-789';
    const mockGenerateResponse = { reportId: reportId, status: 'PENDING' };
    const mockPollSuccessResponse = { reportId: reportId, status: 'SUCCESS' };

    service.reportIdOnSuccess$.subscribe(emittedReportId => {
      expect(emittedReportId).toBe(reportId);
      done();
    });

    service.generateReport(testToken).subscribe();

    // Expect initial generate report call
    httpTestingController.expectOne('/api/v1/report/generate').flush(mockGenerateResponse);

    // Expect polling call and flush with SUCCESS status
    httpTestingController.expectOne(`/api/v1/report/status/${reportId}`).flush(mockPollSuccessResponse);
  });

  it('should poll for in-progress status updates until a final status is received', (done) => {
    const testToken = 'test-token-123';
    const reportId = 'report-polling-123';
    const mockGenerateResponse = { reportId: reportId, status: 'PENDING' };
    const mockPollPendingResponse = { reportId: reportId, status: 'PENDING' };
    const mockPollSuccessResponse = { reportId: reportId, status: 'SUCCESS' };

    let statusUpdates: ReportStatus[] = [];
    service.getStatus().subscribe(status => {
      statusUpdates.push(status);
    });

    service.generateReport(testToken).subscribe();

    // Expect initial generate report call
    httpTestingController.expectOne('/api/v1/report/generate').flush(mockGenerateResponse);

    // Expect first polling call (PENDING)
    httpTestingController.expectOne(`/api/v1/report/status/${reportId}`).flush(mockPollPendingResponse);

    // Expect second polling call (PENDING)
    httpTestingController.expectOne(`/api/v1/report/status/${reportId}`).flush(mockPollPendingResponse);

    // Expect final polling call (SUCCESS)
    httpTestingController.expectOne(`/api/v1/report/status/${reportId}`).flush(mockPollSuccessResponse);

    // After all flushes, check the status updates
    setTimeout(() => {
      expect(statusUpdates).toEqual([
        ReportStatus.IDLE, // Initial status
        ReportStatus.GENERATING, // After generateReport call
        ReportStatus.GENERATING, // After first poll (still pending)
        ReportStatus.GENERATING, // After second poll (still pending)
        ReportStatus.SUCCESS // After final poll
      ]);
      done();
    }, 0); // Use setTimeout to allow all async operations to complete
  });
});
