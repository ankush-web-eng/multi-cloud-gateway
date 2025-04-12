from twilio.rest import Client
import os

def send_sms(data):
    client = Client(os.getenv("TWILIO_SID"), os.getenv("TWILIO_AUTH"))
    client.messages.create(
        body=data["body"],
        from_=os.getenv("TWILIO_PHONE"),
        to=data["to"]
    )
