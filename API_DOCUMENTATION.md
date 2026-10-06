# API Documentation: Customised T-Shirt Brand

## Base URL
`http://localhost:5000/api` (Development)

---

## 1. Authentication Endpoints

### 1.1 Register User
- **URL:** `/auth/register`
- **Method:** `POST`
- **Access:** Public
- **Body payload:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response:** `201 Created`
  ```json
  {
    "success": true,
    "token": "jwt_token_string",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
  ```

### 1.2 Login User
- **URL:** `/auth/login`
- **Method:** `POST`
- **Access:** Public
- **Body payload:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response:** `200 OK` (Sets HTTP-Only Cookie)

### 1.3 Get Current User
- **URL:** `/auth/me`
- **Method:** `GET`
- **Access:** Private (Requires Token)
- **Success Response:** `200 OK`

### 1.4 Logout
- **URL:** `/auth/logout`
- **Method:** `GET`
- **Access:** Private
- **Success Response:** `200 OK` (Clears Cookie)

---

## 2. Product Endpoints

### 2.1 Get All Products
- **URL:** `/products`
- **Method:** `GET`
- **Access:** Public
- **Query Params:** `?category=Men&sort=-price&page=1&limit=10`
- **Success Response:** `200 OK`
  ```json
  {
    "success": true,
    "count": 10,
    "pagination": {},
    "data": [
      {
        "_id": "prod_id",
        "name": "Premium Tee",
        "price": 29.99
      }
    ]
  }
  ```

### 2.2 Get Single Product
- **URL:** `/products/:id`
- **Method:** `GET`
- **Access:** Public
- **Success Response:** `200 OK`

### 2.3 Create Product
- **URL:** `/products`
- **Method:** `POST`
- **Access:** Private / Admin Only
- **Body payload:** Product object (name, description, price, etc.)

---

## 3. Order Endpoints

### 3.1 Create Order
- **URL:** `/orders`
- **Method:** `POST`
- **Access:** Private
- **Body payload:**
  ```json
  {
    "orderItems": [
      {
        "name": "Customized Tee",
        "qty": 1,
        "price": 29.99,
        "product": "prod_id",
        "color": "#ffffff",
        "size": "L",
        "customDesign": {
          "designImage": "data:image/png;base64,...",
          "addedText": "Hello World"
        }
      }
    ],
    "shippingAddress": { ... },
    "paymentMethod": "Stripe",
    "itemsPrice": 29.99,
    "taxPrice": 2.00,
    "shippingPrice": 5.00,
    "totalPrice": 36.99
  }
  ```

### 3.2 Get My Orders
- **URL:** `/orders/myorders`
- **Method:** `GET`
- **Access:** Private
- **Success Response:** `200 OK`

## Tools & Technologies Used
- **Database:** MongoDB (Mongoose ODM)
- **Backend:** Node.js, Express.js
- **Security:** bcryptjs (hashing), jsonwebtoken (auth), helmet (HTTP headers), express-rate-limit (DDoS protection)
- **Frontend:** React.js (Vite), Tailwind CSS, Framer Motion (animations), Fabric.js (Canvas API for T-Shirt customization)
- **State Management:** Zustand (planned) / React Context
