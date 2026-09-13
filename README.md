# 🛍️ GenZMart — Modern E-Commerce Platform

<p align="center">
  <strong>A modern, full-stack e-commerce platform built with Next.js, React, TypeScript, Tailwind CSS and a Core PHP REST API.</strong>
</p>

<p align="center">
  <a href="https://genzemart.vercel.app">
    <img src="https://img.shields.io/badge/🌐%20Live%20Demo-GenZMart-000000?style=for-the-badge" alt="Live Demo" />
  </a>
  <a href="https://github.com/ARSHAD-12356/GenZMart-API">
    <img src="https://img.shields.io/badge/⚙️%20Backend-Repository-181717?style=for-the-badge&logo=github" alt="Backend Repository" />
  </a>
  <img src="https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

---

## ✨ Overview

**GenZMart** is a modern e-commerce platform designed to provide a smooth, responsive and engaging shopping experience.

The project was built with a focus on:

- ⚡ Fast and responsive user experience
- 🛒 Complete e-commerce workflow
- 🔐 Authentication and role-based access
- 📦 Product browsing and management
- 💳 Order and purchase workflow
- 🤖 Modern AI-inspired UI elements
- 📱 Responsive design across devices
- 🔗 Real production API integration

The frontend communicates with a **Core PHP REST API** deployed separately in production.

---

## 🚀 Live Project

### 🌐 Live Website

**https://genzemart.vercel.app**

### ⚙️ Live Backend API

**https://genzmart-api.onrender.com/api**

### 💻 Frontend Repository

**https://github.com/ARSHAD-12356/GenZMart**

### 🛠️ Backend Repository

**https://github.com/ARSHAD-12356/GenZMart-API**

---

## 🧩 Architecture

```text
                    ┌─────────────────────┐
                    │   GenZMart Frontend │
                    │   Next.js + React   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Vercel         │
                    │   Frontend Hosting  │
                    └──────────┬──────────┘
                               │
                         REST API Calls
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Core PHP API     │
                    │   Docker + Apache   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     MySQL Database  │
                    │       FreeDB        │
                    └─────────────────────┘
🛠️ Tech Stack
Frontend
Technology	Purpose
Next.js	React framework & application architecture
React	UI development
TypeScript	Type-safe development
Tailwind CSS	Responsive styling
shadcn/ui	Reusable UI components
Lucide Icons	Modern icon system
Backend
Core PHP
RESTful APIs
MySQL
PDO
Authentication & Sessions
Role-based access control
Deployment
Vercel — Frontend
Render — Backend API
FreeDB — MySQL database
Docker — Backend containerization
GitHub — Source control
🎯 Key Features
👤 Authentication
User registration
User login
Session/token-based authentication
Protected routes
Role-based access
🛍️ Shopping Experience
Product browsing
Product categories
Search and filtering
Product details
Product variants
Cart management
Wishlist functionality
📦 Orders
Checkout workflow
Order creation
Order history
Order status tracking
Order item management
🧑‍💼 Multiple User Roles

GenZMart supports multiple roles including:

👑 Admin
🏪 Seller
🛒 Customer

Each role has different responsibilities and access levels.

🎨 Modern UI
Clean and modern interface
Responsive layouts
Interactive components
Smooth navigation
Mobile-friendly design
Modern dashboard-style sections

GenZMart/
│
├── app/
│   ├── auth/
│   ├── cart/
│   ├── checkout/
│   ├── products/
│   ├── orders/
│   └── ...
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── products/
│   └── ...
│
├── lib/
│   ├── services.ts
│   ├── api/
│   └── utils/
│
├── public/
│
├── styles/
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
🔌 API Integration

The frontend uses a configurable API base URL.

Local Development
NEXT_PUBLIC_API_URL=http://localhost/GenZMart-API/api
Production
NEXT_PUBLIC_API_URL=https://genzmart-api.onrender.com/api

This allows the same frontend codebase to work with both local development and the live production API.

⚙️ Getting Started
1️⃣ Clone the repository
git clone https://github.com/ARSHAD-12356/GenZMart.git
cd GenZMart
2️⃣ Install dependencies
npm install
3️⃣ Create environment file

Create a .env.local file:

NEXT_PUBLIC_API_URL=http://localhost/GenZMart-API/api

For production:

NEXT_PUBLIC_API_URL=https://genzmart-api.onrender.com/api
4️⃣ Start development server
npm run dev

The application will be available at:

http://localhost:3000
🧪 Production Verification

The production backend has been tested independently before connecting the frontend.

Example successful registration response:

{
  "success": true,
  "message": "User account registered successfully"
}

This confirms successful communication between the frontend architecture, production API and MySQL database.

📸 Project Preview

Add screenshots or a short demo video here.

You can showcase:

🏠 Homepage
🛍️ Product listing
📦 Product details
🛒 Cart
💳 Checkout
👤 Authentication
📊 Dashboard
📱 Mobile responsive UI
🔐 Environment Variables

Never commit sensitive credentials to GitHub.

Example:

NEXT_PUBLIC_API_URL=

Backend database credentials are managed separately through server-side environment variables.

📈 Future Improvements

Some planned improvements include:

💳 Real payment gateway integration
📧 Email notifications
🔔 Real-time order notifications
❤️ Advanced wishlist features
📊 Advanced seller analytics
🤖 AI-powered product recommendations
🔎 Smarter product search
☁️ Scalable cloud infrastructure
💡 What I Learned

Building GenZMart helped me gain practical experience in:

Full-stack application architecture
REST API integration
Authentication flows
Database-driven applications
Environment variable management
CORS configuration
Docker-based deployment
Cloud deployment
Production debugging
Connecting a frontend to a remotely hosted MySQL database

One of the biggest lessons from this project:

A project that works on localhost is only the beginning. Making it work reliably in production is where the real learning happens.

👨‍💻 Author
Md Arshad Raza

Frontend Developer | Full Stack Developer | Data Analyst

📍 Patna, India

🔗 GitHub:
https://github.com/ARSHAD-12356

🔗 LinkedIn:
https://www.linkedin.com/in/md-arshad-raza-b5097722a/

⭐ Support

If you found this project interesting, consider giving the repository a ⭐.

Thanks for checking out GenZMart! 🚀
