int redPin = 9;  
int greenPin = 10; 
int bluePin = 11;  

void setup() {
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  Serial.begin(9600); //Bluetooth връзка
}

void loop() {
  if (Serial.available()) {
    String data = Serial.readString();
      if (data.length() == 9) {
        int red = data.substring(0, 3).toInt();
        int green = data.substring(3, 6).toInt();
        int blue = data.substring(6, 9).toInt();

        analogWrite(redPin, red);
        analogWrite(greenPin, green);
        analogWrite(bluePin, blue);

        Serial.print("RGB: ");
        Serial.print(red);     Serial.print(", ");
        Serial.print(green);   Serial.print(", ");
        Serial.print(blue);  
      }
  }
}