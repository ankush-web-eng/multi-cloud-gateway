from twilio.rest import Client
import os

def send_whatsapp(data):
    client = Client(os.getenv("TWILIO_SID"), os.getenv("TWILIO_AUTH"))
    client.messages.create(
        body=data["body"],
        from_='whatsapp:' + os.getenv("TWILIO_PHONE"),
        to='whatsapp:' + data["to"]
    )
