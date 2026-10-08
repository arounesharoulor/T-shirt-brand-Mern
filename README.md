# CustomTees - E-Commerce Platform

![CustomTees Hero](frontend/public/vite.svg) <!-- Replace with actual hero image if available -->

CustomTees is a full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application that allows users to browse pre-designed T-shirts, customize them with their own text or uploaded images, and order them securely. It includes a comprehensive Admin Dashboard to manage products, customers, coupons, and orders.

---

## 🌟 Features

### 🛒 Customer Features
- **Authentication**: Secure user registration and login with JWT.
- **Product Catalog**: Browse and search through T-shirts, filtered by category.
- **Customization Engine**: 
  - Change T-shirt colors dynamically.
  - Add custom text, adjust fonts, sizes, and colors.
  - Upload custom designs/logos and position them precisely on the T-shirt.
- **Shopping Cart**: Add products (both pre-designed and customized) to the cart, modify quantities, and apply discount coupons.
- **Checkout & Payments**: 
  - Secure integration with **Razorpay** for online payments.
  - **Cash on Delivery (COD)** support.
- **Order Tracking**: View order history and real-time statuses.

### 🛡️ Admin Features
- **Admin Dashboard**: High-level overview of revenue, total orders, and total customers.
- **Manage Products**: Create, read, update, and delete T-shirts. Manage stock quantities and product images (via Cloudinary).
- **Manage Orders**: View all customer orders, update shipping statuses (Pending, In Transit, Delivered, Cancelled, Returned), and process refunds (with refund proof image uploads).
- **Manage Customers**: View registered users and remove abusive or inactive accounts.
- **Manage Coupons**: Generate discount codes specifying the percentage off, completely integrated with the checkout system.

---

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- React Router (Navigation)
- React Hot Toast (Notifications)
- Lucide React (Icons)
- Fabric.js (Canvas-based T-shirt customization)
- Razorpay Checkout (Payment Gateway)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcrypt.js (Authentication)
- Cloudinary & Multer (Image storage and upload)
- Razorpay Node SDK

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB account (MongoDB Atlas)
- Cloudinary account
- Razorpay account

### 1. Clone the repository
```bash
git clone https://github.com/arounesharoulor/T-shirt-brand-Mern.git
cd T-shirt-brand-Mern
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `/backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay Config
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Run the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Update API endpoints if needed (defaults to production URL `https://t-shirt-brand-mern.onrender.com` in the code, but you can change it to `http://localhost:5000` for local development).

Run the frontend development server:
```bash
npm run dev
```

---

## 📂 Project Structure

```text
T-shirt-brand-Mern/
├── backend/
│   ├── controllers/      # Route controllers (auth, product, order, coupon, user)
│   ├── middleware/       # JWT Auth and Admin protection
│   ├── models/           # Mongoose schemas (User, Product, Order, Coupon)
│   ├── routes/           # Express API routes
│   └── server.js         # Entry point for backend
│
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI components (Navbar, Admin Layouts)
    │   ├── context/      # React Context (Auth, Cart, Currency)
    │   ├── pages/        # Main pages (Home, Shop, Customizer, Checkout, Admin pages)
    │   ├── App.jsx       # Route definitions
    │   └── main.jsx      # React entry point
    ├── public/
    └── index.html
```

---

## 📜 API Documentation

A detailed API documentation outlining all available endpoints, required payloads, and responses is available in the [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) file.

---

## 🚀 Deployment

- **Frontend**: The frontend is optimized for deployment on [Vercel](https://vercel.com). A `vercel.json` file is included to handle client-side routing.
- **Backend**: The backend is configured for deployment on [Render](https://render.com) or Heroku. Ensure all environment variables are added to your hosting provider's dashboard.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
