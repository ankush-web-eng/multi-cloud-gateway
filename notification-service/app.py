from flask import Flask
from kafka import KafkaConsumer
import json, threading, os, requests
from utils.email import send_email
from utils.sms import send_sms
from utils.whatsapp import send_whatsapp
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

JOB_STATUS_URL = "http://localhost:8000/update"

def consume():
    consumer = KafkaConsumer(
        os.getenv("TOPIC"),
        bootstrap_servers=os.getenv("KAFKA_BOOTSTRAP_SERVERS"),
        value_deserializer=lambda m: json.loads(m.decode("utf-8")),
        group_id="notification-service"
    )

    for msg in consumer:
        receive = msg.value
        key = msg.key.decode("utf-8") if msg.key else None
        data = receive.get("data")
        print(f"Received: {data}")
        channel = data.get("channel")
        payload = data.get("data")

        try:
            if channel == "email":
                send_email(payload)
                result = {"message": "Email sent successfully", "recipient": payload["to"]}
            elif channel == "sms":
                send_sms(payload)
                result = {"message": "SMS sent successfully", "recipient": payload["to"]}
            elif channel == "whatsapp":
                send_whatsapp(payload)
                result = {"message": "WhatsApp message sent successfully", "recipient": payload["to"]}
            else:
                raise ValueError(f"Unsupported channel: {channel}")
                
            if JOB_STATUS_URL and key:
                requests.post(
                    JOB_STATUS_URL,
                    json={
                        "status": "success",
                        "key": key,
                        "result": result
                    },
                    headers={"Content-Type": "application/json"}
                )
                print(f"Reported success for job {key}")
                
        except Exception as e:
            print(f"[Retry Needed] Error: {e}")
            if JOB_STATUS_URL and key:
                requests.post(
                    JOB_STATUS_URL,
                    json={
                        "status": "failed",
                        "key": key,
                        "error": str(e)
                    },
                    headers={"Content-Type": "application/json"}
                )
                print(f"Reported failure for job {key}")

@app.route("/")
def home():
    return "Notification Microservice Running"

if __name__ == "__main__":
    threading.Thread(target=consume).start()
    app.run(host='0.0.0.0', port=5002)