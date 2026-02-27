# 🌍 Travel Buddy Backend Architecture

A robust, fully scalable, production-ready backend built with **Node.js, Express, TypeScript, and Prisma ORM**. This project powers the Travel Buddy platform, helping users find travel companions and plan trips seamlessly.

## 🚀 Key Features (CV Highlights)
- **Advanced Layered Architecture:** Routes -> Controller -> Service structure ensuring separation of concerns and maintainability.
- **Robust Security Middleware:** Implements `helmet` for HTTP header security and `express-mongo-sanitize` to defend against NoSQL injection attacks.
- **Microservice Integration Ready:** Contains well-structured RESTful APIs and clean Database schemas using Prisma and MongoDB.
- **Real-time Collaboration:** Backed by **Socket.io** to enable real-time messaging between users in shared travel plans. 
- **Dockerized Infrastructure:** Comprehensive `docker-compose` and `Dockerfile` setups allowing seamless zero-config local deployment containing MongoDB, Redis, and Express.
- **Redis High-Performance Caching:** Integrated Redis caching layer in large querying endpoints (`getAllTravelPlans`) to reduce latency and database load.
- **Swagger Interactive Documentation:** Developer-friendly interactive UI (`/api-docs`) to explore APIs locally and effectively.
- **Stripe Webhook Payments:** Full lifecycle payment process, verified through Stripe webhooks natively and securely.
- **Admin Analytics Dashboard:** Powerful admin-level APIs fetching concurrent aggregations to monitor overall platform health.

## 🛠️ Tech Stack
| Component | Technology |
|---|---|
| Runtime | Node.js & Express.js |
| Language | TypeScript |
| ORM / Database | Prisma Client & MongoDB |
| Caching & Memory | Redis |
| Authentication | Passport.js (Google OAuth2), JWT Tokens |
| WebSockets | Socket.io |
| Security | Helmet, Express-Mongo-Sanitize, CORS, Zod Validation |
| Containerization | Docker & Docker Compose |

## 📚 Interactive API Docs
Run the server and visit `http://localhost:5000/api-docs` to access the full Swagger API documentation. You can test all endpoints including Travel Plans, Join Requests, Authentication, and Socket handlers directly via the intuitive UI.

## ⚙️ Getting Started

### Method 1: Docker (Recommended)
Just ensure Docker is installed and run:
```bash
# In the root project folder
docker-compose up --build -d
```

### Method 2: Manual Setup
1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Environment Setup:** Set your `.env` variables (e.g., `DATABASE_URL`, `REDIS_HOST`, `JWT_SECRET`).
3. **Database Sync:**
   ```bash
   npx prisma generate
   ```
4. **Start Application:**
   ```bash
   npm run dev
   ```

## 📈 Platform Analytics API
The newly built `/api/v1/admin/stats` securely powers administrative dashboards through concurrent Prisma Aggregations!