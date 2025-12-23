// Google Apps Script to handle Reservation Form submissions

// 1. Open your Google Sheet
// 2. Go to Extensions > Apps Script
// 3. Paste this code
// 4. Run the 'setup' function once to create headers
// 5. Deploy > New Deployment > Web App > Who has access: Anyone > Deploy
// 6. Copy the Web App URL

const SHEET_NAME = 'Reservations';

function doPost(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        const doc = SpreadsheetApp.getActiveSpreadsheet();
        let sheet = doc.getSheetByName(SHEET_NAME);

        if (!sheet) {
            sheet = doc.insertSheet(SHEET_NAME);
            sheet.appendRow(['Timestamp', 'Name', 'Email', 'Date', 'Time', 'Guests']);
        }

        const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        const nextRow = sheet.getLastRow() + 1;

        const newRow = headers.map(function (header) {
            if (header === 'Timestamp') return new Date();
            return e.parameter[header.toLowerCase()] || '';
        });

        sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

        return ContentService
            .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
            .setMimeType(ContentService.MimeType.JSON);
    }

    catch (e) {
        return ContentService
            .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
            .setMimeType(ContentService.MimeType.JSON);
    }

    finally {
        lock.releaseLock();
    }
}

function setup() {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = doc.getSheetByName(SHEET_NAME);
    if (!sheet) {
        sheet = doc.insertSheet(SHEET_NAME);
        sheet.appendRow(['Timestamp', 'Name', 'Email', 'Date', 'Time', 'Guests']);
    }
}
