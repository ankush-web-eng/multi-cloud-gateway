from flask import Flask
from kafka import KafkaConsumer
import json, threading, os
from utils.email import send_email
from utils.sms import send_sms
from utils.whatsapp import send_whatsapp
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

def consume():
    consumer = KafkaConsumer(
        os.getenv("TOPIC"),
        bootstrap_servers=os.getenv("KAFKA_BOOTSTRAP_SERVERS"),
        value_deserializer=lambda m: json.loads(m.decode("utf-8")),
        group_id="notification-group"
    )

    for msg in consumer:
        data = msg.value
        print(f"Received: {data}")
        channel = data.get("channel")
        payload = data.get("data")

        try:
            if channel == "email":
                send_email(payload)
            elif channel == "sms":
                send_sms(payload)
            elif channel == "whatsapp":
                send_whatsapp(payload)
        except Exception as e:
            print(f"[Retry Needed] Error: {e}")

@app.route("/")
def home():
    return "Notification Microservice Running"

if __name__ == "__main__":
    threading.Thread(target=consume).start()
    app.run(port=5002)
