//Paste this into appscript of your google sheet


function doGet(e) {
    try {
      // Check if this is a request for JSON data (from website)
      if (e.parameter && e.parameter.action === 'getData') {
        return getAttendanceData(e);
      }
      
      // Handle attendance logging (from ESP32)
      var result = 'OK';
      
      // Log the incoming request for debugging
      console.log('Incoming request parameters:', JSON.stringify(e.parameter));
      
      // Check for required parameters
      if (!e.parameter || !e.parameter.Student_ID || !e.parameter.Student_Name) {
        console.log('Missing parameters. Received:', e.parameter);
        return ContentService.createTextOutput("Missing 'Student_ID' or 'Student_Name' parameter");
      }
      
      var id = stripQuotes(e.parameter.Student_ID);
      var name = stripQuotes(e.parameter.Student_Name);
      
      // URL decode the name
      name = decodeURIComponent(name);
      
      console.log('Processing attendance for ID:', id, 'Name:', name);
      
      // var sheet = SpreadsheetApp.openById('1XTOJ1mfmL3d7CaA6sjSfAvwu5CzTZgWY4DODSvzMJzM').getActiveSheet();
  const sheetName = "Today";
  var sheet = SpreadsheetApp.openById('1XTOJ1mfmL3d7CaA6sjSfAvwu5CzTZgWY4DODSvzMJzM').getSheetByName(sheetName);
  
      
      // Get current date and time in Asia/Dhaka timezone
      var now = new Date();
      var dateTime = Utilities.formatDate(now, 'Asia/Dhaka', "dd/MM/yyyy HH:mm:ss");
      var dateStr = Utilities.formatDate(now, 'Asia/Dhaka', "yyyy-MM-dd");
      var timeStr = Utilities.formatDate(now, 'Asia/Dhaka', "HH:mm:ss");
      
      // Prepare row: [Student_ID, Student_Name, Date, Time, DateTime]
      var row = [id, name, dateStr, timeStr, dateTime];
      
      console.log('Appending row to sheet:', row);
      
      // Append to sheet
      sheet.appendRow(row);
      
      console.log('Successfully logged attendance');
      
      return ContentService.createTextOutput(result);
      
    } catch (error) {
      console.error('Error in doGet:', error.toString());
      return ContentService.createTextOutput("Error: " + error.toString());
    }
  }
  
  // Function to get attendance data for website dashboard
  function getAttendanceData(e) {
    try {
      console.log('Getting attendance data for dashboard...');
      
      var sheet = SpreadsheetApp.openById('1XTOJ1mfmL3d7CaA6sjSfAvwu5CzTZgWY4DODSvzMJzM').getActiveSheet();
      var data = sheet.getDataRange().getValues();
      
      console.log('Sheet data rows:', data.length);
      
      if (data.length <= 1) {
        // No data or only headers
        console.log('No attendance data found, returning empty array');
        return ContentService
          .createTextOutput(JSON.stringify([]))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      // Skip header row and process data
      var result = [];
      
      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        // Check if student_id exists and is not empty
        if (row[0] && row[0].toString().trim() !== '') {
          result.push({
           datetime: row[0].toString(),
            student_id: row[1] ? row[1].toString() : 'Unknown',
            student_name: row[2] ? row[2].toString() : '',
            date: row[3] ? row[3].toString() : '',
            time: row[4] ? row[4].toString() : '',
            // Add stats for dashboard
            ta: result.length + 1, // today's attendance count
            ts: 120, // total students
            pr: Math.round(((result.length + 1) / 120) * 100) // percentage
          });
        }
      }
      
      // Sort by datetime (most recent first)
      result.sort(function(a, b) {
        try {
          var dateA = new Date(a.datetime || a.date + ' ' + a.time);
          var dateB = new Date(b.datetime || b.date + ' ' + b.time);
          return dateB - dateA;
        } catch (e) {
          return 0;
        }
      });
      
      console.log('Returning ' + result.length + ' attendance records');
      
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
        
    } catch (error) {
      console.error('Error getting attendance data:', error.toString());
      return ContentService
        .createTextOutput(JSON.stringify({
          error: error.toString(),
          message: "Failed to fetch attendance data"
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // Helper to remove quotes
  function stripQuotes(value) {
    if (!value) return value;
    return value.toString().replace(/^["']|["']$/g, "");
  }
  
  // Function to handle POST requests
  function doPost(e) {
    return doGet(e);
  }
  
  // Test function to manually check if the script works
  function testGetData() {
    var result = getAttendanceData({parameter: {action: 'getData'}});
    console.log('Test result:', result.getContent());
    return result.getContent();
  }
