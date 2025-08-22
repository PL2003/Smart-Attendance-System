# 📊 Fingerprint Attendance System

A complete **real-time attendance monitoring system** that combines fingerprint scanning with a live web dashboard. This project integrates hardware (Arduino/ESP32 with fingerprint sensor) with Google Sheets for data storage and a modern web interface for monitoring.

## 🌟 Features

- **Real-time Attendance Tracking**: Live updates from fingerprint sensor
- **Beautiful Web Dashboard**: Modern, responsive interface with statistics
- **Google Sheets Integration**: Secure cloud-based data storage
- **Automatic Status Detection**: Present/Late/Absent based on time rules
- **Student Database Management**: Separate sheet for student information
- **Mobile Responsive**: Works on all devices
- **Auto-refresh**: Dashboard updates every 30 seconds
- **Date Filtering**: View attendance for any specific date
- **Statistics Dashboard**: Today's count, total students, attendance rate

## 🏗️ System Architecture

```
Fingerprint Sensor → Arduino/ESP32 → Google Apps Script → Google Sheets
                                            ↓
                    Web Dashboard ←── Google Apps Script API
```

## 📁 Project Structure

```
fingerprint-attendance-system/
├── README.md
├── web-dashboard/
│   └── index.html              # Main web dashboard
├── google-apps-script/
│   └── Code.gs                 # Google Apps Script code
├── arduino-code/
│   └── attendance_system.ino   # Arduino/ESP32 code (if available)
├── docs/
│   ├── setup-guide.md         # Detailed setup instructions
│   ├── troubleshooting.md     # Common issues and solutions
│   └── screenshots/           # System screenshots
└── LICENSE
```

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **Hardware**: Arduino/ESP32, Fingerprint Sensor (R305/R307)
- **Connectivity**: WiFi (ESP32) or Ethernet Shield (Arduino)

## 🚀 Quick Start

### Prerequisites

- Google Account
- Basic knowledge of Google Sheets and Apps Script
- Web browser
- (Optional) Arduino/ESP32 with fingerprint sensor for hardware integration

### 1. Set Up Google Sheets

1. Create a new Google Sheet
2. **Sheet1** - Attendance Records with these columns:
   ```
   A: DateTime          | B: Student_ID | C: Student_Name | D: Date       | E: Time    | F: Status
   2025-08-05 09:52:00 | 2209009       | Prattay         | 2025-08-05   | 09:52:00   | Present
   ```

3. **Sheet2** - Student Database with these columns:
   ```
   A: ID     | B: Name    | C: Roll_Number | D: Class
   2209009   | Prattay    | 2209009        | 22
   2209010   | John Doe   | 2209010        | 22
   ```

4. Get your **Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```

### 2. Deploy Google Apps Script

1. Open [Google Apps Script](https://script.google.com/)
2. Create a new project
3. Replace the default code with the code from `google-apps-script/Code.gs`
4. Update the `SPREADSHEET_ID` variable with your actual Sheet ID:
   ```javascript
   const SPREADSHEET_ID = 'your_actual_spreadsheet_id_here';
   ```
5. Save the project
6. Deploy as Web App:
   - Click **Deploy** → **New Deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**
   - Copy the **Web App URL**

### 3. Set Up Web Dashboard

1. Download `web-dashboard/index.html`
2. Open in a text editor
3. Update the Web App URL:
   ```javascript
   const WEBAPP_URL = 'your_web_app_url_here';
   ```
4. Save and open in a web browser

### 4. Test the System

1. Open the web dashboard
2. Click "Refresh Data"
3. Check browser console (F12) for any errors
4. Test with sample data in Google Sheets

## 📱 Web Dashboard Features

### Statistics Cards
- **Today's Attendance**: Number of students present today
- **Total Students**: Total students in database (from Sheet2)
- **Attendance Rate**: Percentage of students present today
- **Last Entry**: Time of most recent attendance

### Controls
- **Date Filter**: View attendance for any specific date
- **Refresh Button**: Manually refresh data
- **Last Updated**: Shows when data was last refreshed

### Attendance Table
- Real-time list of attendance records
- Sortable by time (most recent first)
- Color-coded status (Present/Late/Absent)
- Responsive design for mobile devices

## ⚙️ Configuration

### Time-based Status Rules
```javascript
// In Google Apps Script
var hour = date.getHours();
var minute = date.getMinutes();
var status = (hour < 9 || (hour === 9 && minute <= 30)) ? "Present" : "Late";
```

**Default Rules:**
- **Present**: Before 9:30 AM
- **Late**: After 9:30 AM
- **Absent**: Marked automatically (if using absent marking function)

### Auto-refresh Settings
```javascript
// In web dashboard - refresh every 30 seconds
setInterval(refreshData, 30000);
```

## 🔧 Hardware Integration

If you're using Arduino/ESP32 with fingerprint sensor:

### Required Components
- ESP32 or Arduino board
- R305/R307 Fingerprint Sensor
- WiFi connection (for ESP32)
- Breadboard and jumper wires

### Arduino Code Structure
```cpp
// POST request to Google Apps Script
String url = "your_web_app_url";
String postData = "id=" + studentId + "&timestamp=" + timestamp;
http.POST(postData);
```

### Hardware Connections
```
Fingerprint Sensor → ESP32
VCC → 3.3V
GND → GND
TX  → GPIO16 (RX2)
RX  → GPIO17 (TX2)
RX  → GPIO17 (TX2)

20*4 LED Display → ESP32
SCA  → GPIO21
SDL  → GPIO22

```

## 🔐 Security Considerations

1. **Google Sheets Access**: Set appropriate sharing permissions
2. **Apps Script Execution**: Run as your account, allow access to anyone with link
3. **Data Validation**: Script validates student IDs against database
4. **HTTPS**: All communications use HTTPS encryption

## 🎨 Customization

### Styling
The web dashboard uses modern CSS with:
- Gradient backgrounds
- Glassmorphism effects
- Smooth animations
- Responsive grid layout

### Adding Features
You can extend the system by:
- Adding more statistics
- Implementing user authentication
- Creating attendance reports
- Adding email notifications
- Integrating with school management systems

## 📊 Google Sheets Functions

### Available API Endpoints

| Endpoint | Description |
|----------|-------------|
| `?action=getAttendance` | Get all attendance records |
| `?action=getAttendance&date=YYYY-MM-DD` | Get attendance for specific date |
| `?action=getStats` | Get attendance statistics |
| `?action=getStudents` | Get student database |
| `?id=STUDENT_ID&timestamp=UNIX_TIME` | Mark attendance (from hardware) |

### Utility Functions
- `generateDailyReport(date)` - Generate report for specific date
- `markAbsentStudents()` - Mark all absent students at end of day

## 🔍 Troubleshooting

### Common Issues

**"Failed to fetch attendance data"**
- Check Web App URL is correct
- Verify Google Apps Script is deployed properly
- Ensure spreadsheet ID is correct in script

**"No data showing"**
- Check Google Sheets format matches exactly
- Verify date formats (YYYY-MM-DD)
- Check browser console for errors

**"Permission denied"**
- Redeploy Apps Script with "Anyone" access
- Check Google Sheets sharing settings

**Data not updating**
- Check auto-refresh is working
- Verify Apps Script has access to sheets
- Test connection using browser console: `testConnection()`

### Debug Mode
Open browser console (F12) and run:
```javascript
testConnection()
```

## 📈 Performance

- **Response Time**: ~1-2 seconds for data refresh
- **Data Limit**: Google Sheets supports up to 5 million cells
- **Concurrent Users**: Multiple users can view dashboard simultaneously
- **Auto-refresh**: Every 30 seconds (configurable)

### Development Guidelines
- Follow existing code style
- Test all changes thoroughly
- Update documentation as needed
- Ensure mobile responsiveness

## 📋 Roadmap

- [ ] User authentication system
- [ ] Advanced reporting features
- [ ] Email/SMS notifications
- [ ] Mobile app development
- [ ] Integration with popular LMS platforms
- [ ] Offline capability
- [ ] Multi-school support
- [ ] Advanced analytics dashboard

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Apps Script platform
- Google Sheets API
- Arduino/ESP32 community
- Contributors and testers

## 📞 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting guide](docs/troubleshooting.md)
2. Search existing [GitHub issues](../../issues)
3. Create a new issue with:
   - Detailed description
   - Steps to reproduce
   - Browser/system information
   - Screenshots if applicable

## 🔗 Useful Links

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Arduino ESP32 Guide](https://randomnerdtutorials.com/getting-started-with-esp32/)
- [Fingerprint Sensor Tutorial](https://lastminuteengineers.com/fingerprint-sensor-arduino-tutorial/)

---

⭐ **If this project helped you, please consider giving it a star!**

**Made with ❤️ for educational institutions worldwide**
