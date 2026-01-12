#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <WiFiUdp.h>
#include <NTPClient.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <time.h>
#include <Servo.h>   // Servo library

// Wi-Fi credentials
const char* ssid = "Yan";
const char* password = "CDV0208@";

// Web server
ESP8266WebServer server(80);

// Servo pin
const int servoPin = D1;
Servo feederServo;

// IR sensor pin
const int irPin = D2;

// NTP client setup
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 8 * 3600, 60000); 
// GMT+8 for Philippines, update every 60s

// Schedule variables (default values)
int dayHour = 9, dayMinute = 0;
int nightHour = 18, nightMinute = 0;

// Trigger tracking
bool triggered = false;
unsigned long triggerTime = 0;
int lastMinute = -1;   // keep track of last minute to avoid retriggers

// Firebase database URL
const char* firebaseHost = "https://petfeeder-8cf87-default-rtdb.asia-southeast1.firebasedatabase.app/logs.json";

// Month names
const char* monthNames[] = {
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
};

// Helper: format current local date-time from NTP
String getTimestamp() {
  timeClient.update();
  unsigned long epochTime = timeClient.getEpochTime();
  time_t rawTime = (time_t)epochTime;
  struct tm *ptm = localtime(&rawTime);

  int year   = ptm->tm_year + 1900;
  int month  = ptm->tm_mon; // 0-based index
  int day    = ptm->tm_mday;
  int hour   = ptm->tm_hour;
  int minute = ptm->tm_min;

  char buf[40];
  // Format: "Mon-DD-YYYY HH:MM" (no seconds)
  sprintf(buf, "%s-%02d-%04d %02d:%02d",
          monthNames[month], day, year, hour, minute);
  return String(buf);
}

// Function to send log to Firebase over HTTPS
void sendLog(const String& event) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure();   // skip certificate validation for testing
    HTTPClient http;
    http.begin(client, firebaseHost);   // HTTPS connection
    http.addHeader("Content-Type", "application/json");

    String timestamp = getTimestamp();
    String json = "{\"timestamp\":\"" + timestamp + "\",\"event\":\"" + event + "\"}";
    int httpResponseCode = http.POST(json);

    if (httpResponseCode > 0) {
      Serial.printf("Log sent: %s\n", json.c_str());
      Serial.printf("Response code: %d\n", httpResponseCode);
      String payload = http.getString();
      Serial.println("Firebase response: " + payload);
    } else {
      Serial.printf("Error sending log: %d\n", httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("WiFi not connected, cannot send log");
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(irPin, INPUT);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.print("ESP8266 IP Address: ");
  Serial.println(WiFi.localIP());

  // Start NTP
  timeClient.begin();

  // Attach servo
  feederServo.attach(servoPin);
  feederServo.write(0);   // start at 0°

  // Manual route
  server.on("/servo/feed", []() {
    feederServo.write(180);   // rotate to 180°
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", "Food Served (Manual)");
    Serial.println("Food Served (Manual)");

    sendLog("Food Served (Manual)");

    triggerTime = millis();
    triggered = true;
  });

  // Servo reset route (manual override)
  server.on("/servo/reset", []() {
    feederServo.write(0);   // return to 0°
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", "Servo reset to 0°");
    Serial.println("Servo reset manually");
    triggered = false;
  });

  // Schedule route
  server.on("/setSchedule", []() {
    if (server.hasArg("dayHour")) dayHour = server.arg("dayHour").toInt();
    if (server.hasArg("dayMinute")) dayMinute = server.arg("dayMinute").toInt();
    if (server.hasArg("nightHour")) nightHour = server.arg("nightHour").toInt();
    if (server.hasArg("nightMinute")) nightMinute = server.arg("nightMinute").toInt();

    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", "Schedule updated!");
    Serial.printf("Day schedule: %02d:%02d\n", dayHour, dayMinute);
    Serial.printf("Night schedule: %02d:%02d\n", nightHour, nightMinute);
  });

  // Get current schedule route
  server.on("/getSchedule", []() {
    String json = "{";
    json += "\"dayHour\":" + String(dayHour) + ",";
    json += "\"dayMinute\":" + String(dayMinute) + ",";
    json += "\"nightHour\":" + String(nightHour) + ",";
    json += "\"nightMinute\":" + String(nightMinute);
    json += "}";

    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", json);
    Serial.println("Schedule requested via /getSchedule");
  });

  // IR sensor route
  server.on("/irStatus", []() {
    int irValue = digitalRead(irPin);
    String status = (irValue == HIGH) ? "detected" : "none";
    String json = "{\"status\":\"" + status + "\"}";

    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", json);
    Serial.printf("IR sensor status: %s\n", status.c_str());
  });

  // Default route
  server.on("/", []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", "ESP8266 is running!");
  });

  // Start server
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
  timeClient.update();

  int currentHour = timeClient.getHours();
  int currentMinute = timeClient.getMinutes();

  // Check if it's time to trigger (schedule)
  bool isScheduledTime =
    (currentHour == dayHour && currentMinute == dayMinute) ||
    (currentHour == nightHour && currentMinute == nightMinute);

  if (isScheduledTime && !triggered && currentMinute != lastMinute) {
    feederServo.write(180);   // rotate to 180°
    triggerTime = millis();
    triggered = true;
    lastMinute = currentMinute;  // mark this minute as already triggered
    Serial.println("Food Served (Scheduled)");
    sendLog("Food Served (Scheduled)");
  }

  // Return servo to 0° after 3 seconds
  if (triggered && millis() - triggerTime >= 100) {
    feederServo.write(0);   // return to original position
    Serial.println("Servo returned to 0° after 3 sec");
    triggered = false;
  }
}
