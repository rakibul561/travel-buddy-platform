
---

```md
# 🌍 Travel Buddy & Meetup Platform

A full-stack social travel platform that helps travelers find compatible travel companions, plan trips together, and build trust through reviews and ratings.

---

## 📌 Project Overview

**Travel Buddy & Meetup Platform** aims to create meaningful connections among travelers by helping them discover others traveling to similar destinations.  
The platform combines **travel planning + social networking**, allowing users to share trips, match with others, join travel plans, and review companions after trips are completed.

This is a **subscription-based platform** with premium features such as unlimited trip creation, joining multiple trips, and verified badges.

---

## 🎯 Objectives

- Build a social-travel web platform for connecting travelers  
- Enable trip sharing and traveler matching  
- Allow users to create detailed travel profiles and itineraries  
- Provide a secure and engaging UI/UX  
- Implement role-based authentication and persistence  
- Introduce premium subscriptions for advanced features  

---

## 🚀 Core Features

### 🔐 Authentication & Authorization
- Email & Password authentication
- JWT-based secure authentication
- Role-based access control:
  - **User**
  - **Admin**
- Secure password hashing with bcrypt

---

### 👤 User Profile Management (CRUD)
- Create & update profile
- Upload profile image (Cloudinary / ImgBB)
- Bio / About section
- Travel interests (hiking, food tours, photography, etc.)
- Visited countries
- Current location
- Public profile view

---

### 🧳 Travel Plan Management (CRUD)
- Create, update, delete travel plans
- Destination (country, city)
- Start & end dates
- Budget range
- Travel type (Solo, Family, Friends, Couple)
- Description & itinerary
- Public visibility for matching & discovery

---

### 🔍 Search & Matching System
- Search travelers by:
  - Destination
  - Date range
  - Travel type
- Flexible date matching
- Discover compatible travel buddies

---

### 🤝 Join Request System
- Send join requests to travel plans
- Trip owner can **accept or reject** requests
- Prevent duplicate join requests
- Prevent joining completed trips
- Auto-create participants on acceptance

---

### ⭐ Review & Rating System
- Only available **after trip completion**
- Only trip participants can review each other
- One review per user per trip
- Rating (1–5 stars)
- Written reviews
- Display average rating & recent reviews on profiles

---

### 💳 Payment & Subscription System
- Subscription plans:
  - **FREE**
  - **MONTHLY**
  - **YEARLY**
- Payment gateway integration:
  - Stripe (primary)
  - SSLCommerz (optional)
- Premium features:
  - Unlimited travel plans
  - Unlimited join requests
  - Review access
  - Verified badge
- Subscription expiry handling

---

## 🧑‍💻 Roles & Permissions

### 👤 User
- Create & manage travel plans
- Match with travelers
- Send join requests
- Join trips
- Review travel partners
- Upgrade subscription

### 🛡 Admin
- Manage users
- Manage travel plans
- Monitor platform activity

---

## 🖥 Pages & Routes

### Public Pages
- `/` – Home / Landing Page
- `/login` – Login
- `/register` – Registration
- `/explore` – Search & match travelers

### Authenticated User Pages
- `/profile/[id]` – User profile
- `/travel-plans` – My travel plans
- `/travel-plans/[id]` – Travel plan details
- `/dashboard` – User dashboard

### Admin Pages
- `/admin/dashboard`
- `/admin/users`
- `/admin/travel-plans`

---

## 🗂 Folder Structure

### Frontend
```

frontend/
├── app/
│   ├── (auth)/login, register
│   ├── (user)/profile, travel-plans
│   ├── components/
│   ├── utils/
│   └── styles/

```

### Backend
```

backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── travelPlans/
│   │   ├── joinRequests/
│   │   ├── reviews/
│   │   ├── payments/
│   ├── middlewares/
│   ├── utils/
│   └── routes/

```

---

## 🌐 API Endpoints (Sample)

| Method | Endpoint | Description |
|------|---------|------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/users/:id` | Get user profile |
| PATCH | `/api/users/profile` | Update profile |
| POST | `/api/travel-plans` | Create travel plan |
| GET | `/api/travel-plans` | Get all plans |
| GET | `/api/travel-plans/match` | Match travelers |
| POST | `/api/join-requests` | Send join request |
| PATCH | `/api/join-requests/:id` | Accept/Reject request |
| PATCH | `/api/travel-plans/:id/complete` | Complete trip |
| POST | `/api/reviews` | Add review |
| POST | `/api/payments/create-intent` | Create payment intent |

---

## 🛠 Tech Stack

### Frontend
- React / Next.js
- TypeScript
- Tailwind CSS
- Redux Toolkit (optional)

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL 
- JWT Authentication
- Cloudinary (Image Upload)
- Stripe 

---

## 🔒 Security Features
- JWT-based authentication
- Role-based authorization
- Password hashing
- Secure file uploads
- API validation with Zod
- Prevent duplicate actions (join/review)

---

## 📈 Future Enhancements
- Real-time notifications
- Google Maps integration
- In-app chat system
- Push notifications
- AI-based travel recommendations

---

## 🧑‍🎓 Author
**Rakib**  
Frontend & Backend Developer (MERN Stack)

---

## ⭐ If you like this project
Give it a ⭐ on GitHub — it helps a lot!
```

---

