#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <WiFiUdp.h>
#include <NTPClient.h>

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

  // Manual routes
  server.on("/led/on", []() {
    digitalWrite(ledPin, HIGH);
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", "LED is ON (manual)");
    Serial.println("LED turned ON manually");

    // Auto-off after 5 seconds
    triggerTime = millis();
    triggered = true;
  });

  server.on("/led/off", []() {
    digitalWrite(ledPin, LOW);
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", "LED is OFF (manual)");
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
    Serial.println("LED auto ON by schedule (5 sec)");
  }

  // Turn off LED after 5 seconds (works for both manual and schedule)
  if (triggered && millis() - triggerTime >= 5000) {
    digitalWrite(ledPin, LOW);
    Serial.println("LED auto OFF after 5 sec");
    triggered = false; // reset so it doesn’t keep firing
  }
}
