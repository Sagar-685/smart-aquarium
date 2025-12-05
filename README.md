         +------------------+
         |   ESP32 Board    |
         | (Sensors + Servo)|
         +--------+---------+
                  |
                  |  Sensor Data (Temp, Humidity, TDS, Level)
                  v
        +-----------------------+
        |   Backend Server     |
        | (Node.js + MongoDB)  |
        +----+-----------+-----+
             |           |
             |           | Scheduled Feed / Alerts
             |           v
             |   +------------------+
             |   |  Notification    |
             |   |   System         |
             |   | (Telegram/Email) |
             |   +------------------+
             |
             | API Responses (Latest Data, History, Feed Command)
             v
     +---------------------------+
     |     Frontend Dashboard    |
     | (React — HydroGuardian UI)|
     +------------+--------------+
                  |
                  | Feed Command Trigger
                  v
         +------------------+
         |   ESP32 Servo    |
         | (Dispenses Food) |
         +------------------+
