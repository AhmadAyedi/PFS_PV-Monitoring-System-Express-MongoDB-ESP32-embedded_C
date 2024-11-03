#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

#define DHTPIN 4           // GPIO pin where the DATA pin of DHT11 is connected
#define DHTTYPE DHT11      // DHT 11

const char* ssid = "TOPNET_21F8";         // Replace with your WiFi SSID
const char* password = "yp5qac98w8"; // Replace with your WiFi Password
const char* serverUrl = "http://192.168.1.13:3008/api/temperature"; // Replace with your server's IP

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  
  dht.begin();
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();

    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("Failed to read from DHT sensor!");
      return;
    }

    // Create JSON data to send to the server
    String jsonData = String("{\"temperature\":") + temperature + ",\"humidity\":" + humidity + "}";

    // Send data to server
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    int httpResponseCode = http.POST(jsonData);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  }
  delay(10000); // Send data every 10 seconds
}
