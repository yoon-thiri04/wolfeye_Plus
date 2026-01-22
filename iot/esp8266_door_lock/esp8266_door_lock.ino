#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// WiFi Configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Backend Configuration
const char* backend_url = "http://YOUR_SERVER_IP:8000/api/iot/check_access";
const String device_id = "DOOR_001"; 

// Hardware Configuration
const int SOLENOID_PIN = 5; // D1 on NodeMCU
const int CHECK_INTERVAL = 3000; // Check every 3 seconds

void setup() {
  Serial.begin(115200);
  pinMode(SOLENOID_PIN, OUTPUT);
  digitalWrite(SOLENOID_PIN, LOW); // Lock initially

  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    // Construct URL with device_id
    String url = String(backend_url) + "?device_id=" + device_id;
    
    http.begin(client, url);
    int httpCode = http.GET();

    if (httpCode > 0) {
      String payload = http.getString();
      Serial.println(payload);
      
      // Expected JSON response: {"unlock": true, "duration": 5000}
      if (payload.indexOf("\"unlock\":true") > 0) {
        Serial.println("Unlocking Door...");
        digitalWrite(SOLENOID_PIN, HIGH); // Unlock
        delay(5000); // Keep open for 5 seconds
        digitalWrite(SOLENOID_PIN, LOW);  // Lock again
        
        // Optional: Send acknowledgement back to server
      }
    } else {
      Serial.printf("HTTP GET failed, error: %s\n", http.errorToString(httpCode).c_str());
    }
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
  
  delay(CHECK_INTERVAL);
}
