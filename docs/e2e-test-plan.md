# End-to-End User Flow Testing Plan

This document outlines the end-to-end testing plan for the ChainReport-AI application, covering the full user journey from inputting a token to viewing and interacting with the generated report.

## 1. Input Phase

*   **Objective:** Verify that users can successfully input a token address and initiate the report generation process.
*   **Steps:**
    1.  Navigate to the application's token input form.
    2.  Enter a valid token address into the input field.
    3.  Verify that the "Generate Report" (or similar) button becomes active.
    4.  Click the "Generate Report" button.
    5.  Verify that the application transitions to a loading/polling state or displays a report status indicator.
    6.  Test with invalid token addresses (e.g., malformed, non-existent) and verify appropriate error messages are displayed.
    7.  Test with an empty input field and verify form validation prevents submission.

## 2. Polling Phase

*   **Objective:** Verify that the application correctly polls for report status updates and handles various states.
*   **Steps:**
    1.  After initiating a report, monitor network requests to ensure polling calls are made at regular intervals.
    2.  Simulate different report statuses (e.g., `PENDING`, `IN_PROGRESS`, `FAILED`, `COMPLETED`) from the backend.
    3.  Verify that the UI updates correctly to reflect each status (e.g., loading spinners, progress bars, status messages).
    4.  Verify that polling stops once the report reaches a terminal state (e.g., `COMPLETED`, `FAILED`).
    5.  Test error handling during polling (e.g., network issues, API errors) and ensure graceful degradation or error display.

## 3. Rendering Phase

*   **Objective:** Verify that the generated report content is correctly fetched and rendered in the UI.
*   **Steps:**
    1.  Once a report is `COMPLETED`, verify that the application fetches the full report data.
    2.  Verify that all sections of the report (e.g., Tokenomics, On-chain Metrics, Audit Review, Code Review, Sentiment/Team, Final Summary) are displayed.
    3.  Check for correct data display within each section, comparing against expected values for a known token.
    4.  Verify the responsiveness and layout of the report on different screen sizes and devices.
    5.  Ensure interactive elements (e.g., links, collapsible sections, charts) function as expected.
    6.  Verify that styling and formatting adhere to design specifications.
    7.  Test rendering of reports with varying data completeness (e.g., some sections empty or unavailable) and ensure the UI handles this gracefully.

## 4. Downloading Phase

*   **Objective:** Verify that users can download the generated report in various formats (if applicable).
*   **Steps:**
    1.  Locate the download button or option for the report.
    2.  Click the download button.
    3.  Verify that the browser initiates a download of the report file (e.g., PDF, JSON).
    4.  Open the downloaded file and verify its content matches the displayed report.
    5.  If multiple download formats are supported, test each format.
    6.  Verify error handling for download failures (e.g., network issues, file generation errors).

## 5. Caching Phase

*   **Objective:** Verify that the application correctly utilizes caching mechanisms for performance and data persistence.
*   **Steps:**
    1.  Generate a report for a token.
    2.  Navigate away from the report view and then return to it.
    3.  Verify that the report loads instantly from cache without re-fetching all data from the API (monitor network requests).
    4.  Close and reopen the application (if applicable, for client-side caching beyond session).
    5.  Return to the report view for the previously generated token and verify it's loaded from cache.
    6.  Test scenarios where cached data might be invalidated (e.g., a new report version is available, cache expiry) and ensure the application fetches fresh data.
    7.  Verify that the application does not attempt to cache sensitive user data inappropriately.