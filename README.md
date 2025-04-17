# 🚀 API Gateway Monorepo

- This is curreently in development phase

This project is a Hyper-Scalable API Gateway built using Golang to handle request routing, authentication, rate limiting, payment servide, and caching across multiple microservices and databases. It also includes a Next.js-based frontend dashboard for monitoring API activity.

## 📌 Features

### Architecture Diagram

<div align="center">
<img src = "/assets/architecture.png">
</div>

### API Gateway (Golang)

- Routes requests to PostgreSQL, MongoDB, Redis
- Implements authentication & rate limiting
- Uses Redis for caching & performance optimization

### Frontend (Next.js Dashboard)

- Visualizes API requests & logs
- Allows testing API routes from UI
- Manages API keys & security settings

## 📂 Folder Structure

📦 api-gateway-monorepo
- ┣ 📂 main-server (Go API Gateway)
- ┣ 📂 frontend (Next.js Dashboard)
- ┣ 📂 infra (Docker, Kubernetes, Terraform)
- ┣ 📂 authentication-service (nodejs based)
- ┣ 📂 payment-service (nodejs based)
- ┣ 📂 notification-service (python based)
- ┣ 📜 README.md

🛠️ Setup Instructions

1️⃣ Clone Repository

```bash
git clone https://github.com/ankush-web-eng/multi-cloud-gateway.git
```

2️⃣ Run Backend (API Gateway)

```bash
cd backend
go run main.go
```

3️⃣ Run Frontend (Dashboard)

```bash
cd frontend
yarn install
yarn build && yarn start
```

<!-- 4️⃣ Test API Gateway

```bash
curl http://localhost:8080/api/user/1
``` -->

## 🚀 Future Enhancements

- 🔹 Adding Authentication
- 🔹 Implementing Graph-based API monitoring
- 🔹 Deploying with Kubernetes & Terraform

## 👨‍💻 Contributions are welcome! 🎉
