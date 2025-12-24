# Travel Buddy & Meetup - Backend API

A RESTful API for connecting travelers and helping them find compatible companions for their trips. Built with Node.js, Express, Prisma, and PostgreSQL.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based authentication with role-based access control
- **User Profile Management** - Complete CRUD operations for user profiles with image upload
- **Travel Plan Management** - Create, read, update, and delete travel plans
- **Smart Matching System** - Find compatible travel buddies based on destination, dates, and interests
- **Review & Rating System** - Post-trip reviews and ratings for building trust
- **Payment Integration** - Stripe integration for subscription plans and premium features
- **Image Upload** - Cloudinary integration for profile and media uploads

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)
- **Image Storage:** Cloudinary
- **Payment Gateway:** Stripe
- **Validation:** Zod / Express-validator
- **Security:** bcrypt, helmet, cors

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn
- Cloudinary account
- Stripe account

## ⚙️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd travel-buddy-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/travel_buddy"

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

4. **Set up the database**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed the database
npm run seed
```

5. **Start the development server**
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files (db, cloudinary, stripe)
│   ├── middleware/       # Custom middleware (auth, error handling, validation)
│   ├── modules/
│   │   ├── auth/         # Authentication routes & controllers
│   │   ├── users/        # User management
│   │   ├── travelPlans/  # Travel plan CRUD
│   │   ├── reviews/      # Review system
│   │   ├── payments/     # Payment integration
│   │   └── matching/     # Traveler matching logic
│   ├── utils/            # Helper functions & utilities
│   ├── validators/       # Request validation schemas
│   ├── app.js            # Express app setup
│   └── server.js         # Server entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── migrations/       # Database migrations
│   └── seed.js           # Database seeding script
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/refresh` | Refresh access token | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

### Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/:id` | Get user profile | Yes |
| PATCH | `/api/users/:id` | Update user profile | Yes (Owner) |
| DELETE | `/api/users/:id` | Delete user | Yes (Owner/Admin) |
| GET | `/api/users` | Get all users (Admin) | Yes (Admin) |

### Travel Plans
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/travel-plans` | Create travel plan | Yes |
| GET | `/api/travel-plans` | Get all travel plans | No |
| GET | `/api/travel-plans/:id` | Get travel plan details | No |
| PATCH | `/api/travel-plans/:id` | Update travel plan | Yes (Owner) |
| DELETE | `/api/travel-plans/:id` | Delete travel plan | Yes (Owner/Admin) |
| GET | `/api/travel-plans/user/:userId` | Get user's travel plans | Yes |

### Matching
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/match` | Search & match travelers | Yes |
| POST | `/api/match/request` | Send buddy request | Yes |

### Reviews
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/reviews` | Create review | Yes |
| GET | `/api/reviews/user/:userId` | Get user reviews | No |
| PATCH | `/api/reviews/:id` | Update review | Yes (Owner) |
| DELETE | `/api/reviews/:id` | Delete review | Yes (Owner) |

### Payments
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/payments/create-intent` | Create payment intent | Yes |
| POST | `/api/payments/webhook` | Stripe webhook handler | No |
| GET | `/api/payments/subscription` | Get subscription status | Yes |

## 🗄️ Database Schema

### Key Models

- **User** - User accounts with profile information
- **TravelPlan** - Travel itineraries and plans
- **Review** - User reviews and ratings
- **Subscription** - Premium subscription records
- **BuddyRequest** - Travel companion requests

See `prisma/schema.prisma` for complete schema details.

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control (User, Admin)
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet.js for security headers
- SQL injection prevention via Prisma

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Scripts

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run build        # Build for production
npm test             # Run tests
npm run migrate      # Run database migrations
npm run seed         # Seed database
npm run prisma:studio # Open Prisma Studio
```

## 🚀 Deployment

### Using Railway/Render/Heroku

1. Set up environment variables on your platform
2. Connect your PostgreSQL database
3. Deploy from GitHub repository
4. Run migrations: `npx prisma migrate deploy`

### Using Docker

```bash
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.


## 🙏 Acknowledgments

- Express.js community
- Prisma documentation
- Stripe API guides


**Happy Coding! 🎉**