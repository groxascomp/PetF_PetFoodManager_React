#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <WiFiUdp.h>
#include <NTPClient.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <time.h>

// Wi-Fi credentials
const char* ssid = "DITO_302E3_2.4";
const char* password = "5045d752";

// Web server
ESP8266WebServer server(80);

// LED pin
const int ledPin = D1;

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
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);

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

  // Manual route
  server.on("/led/on", []() {
    digitalWrite(ledPin, HIGH);
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", "Food Served (Manual)");
    Serial.println("Food Served (Manual)");

    sendLog("Food Served (Manual)");

    // Auto-off after 5 seconds
    triggerTime = millis();
    triggered = true;
  });

  // LED off route (no logging)
  server.on("/led/off", []() {
    digitalWrite(ledPin, LOW);
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", "LED is OFF (Manual)");
    Serial.println("LED turned OFF manually");
    triggered = false; // reset flag
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
    digitalWrite(ledPin, HIGH);
    triggerTime = millis();
    triggered = true;
    lastMinute = currentMinute;  // mark this minute as already triggered
    Serial.println("Food Served (Scheduled)");
    sendLog("Food Served (Scheduled)");
  }

  // Turn off LED after 5 seconds (works for both manual and schedule)
  if (triggered && millis() - triggerTime >= 5000) {
    digitalWrite(ledPin, LOW);
    Serial.println("LED auto OFF after 5 sec");
    triggered = false; // reset so it doesn’t keep firing
    // No log here
  }
}
