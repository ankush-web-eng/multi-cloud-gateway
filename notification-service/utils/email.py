import smtplib, os
from email.message import EmailMessage

def send_email(data):
    msg = EmailMessage()
    msg.set_content(data["body"])
    msg["Subject"] = data["subject"]
    msg["From"] = os.getenv("EMAIL_USER")
    msg["To"] = data["to"]

    with smtplib.SMTP(os.getenv("SMTP_SERVER"), int(os.getenv("SMTP_PORT"))) as server:
        server.starttls()
        server.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASS"))
        server.send_message(msg)
