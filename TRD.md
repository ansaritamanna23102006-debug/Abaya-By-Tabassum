# Technical Requirements Document (TRD)
## Project Name: Abaya By Tabassum (Luxury Modest Atelier)
**Author:** AI Engineering Assistant (Antigravity)  
**Date:** June 19, 2026  
**Status:** Completed & Deployed  

---

## 1. System Architecture
The application is split into a decoupled **Client-Server Architecture**:
- **Frontend (Client)**: Next.js 16 (App Router) containing client-rendered views, static pages, and local state integrations. Hosted on Vercel.
- **Backend (Server)**: Node.js & Express.js server exposing RESTful API endpoints. Hosted on Render.
- **Database**: MongoDB Atlas cloud cluster storing products, orders, coupons, users, and reviews collections.

---

## 2. Directory Structure & Code Layout

### 2.1 Frontend Folder Structure
```text
frontend/
├── next.config.mjs               # Next.js configurations & dynamic environment-based API rewrites
├── package.json
└── src/
    ├── app/                      # Next.js App Router (pages & endpoints)
    │   ├── layout.js             # HTML metadata, font-family styling context, providers
    │   ├── page.js               # Homepage (Editorial welcome, featured carousel grid)
    │   ├── globals.css           # Global theme variables, animations, scrollbars, selection rules
    │   ├── shop/                 # Catalog search & filtered grid boutique view
    │   ├── lookbook/             # Interactive spreads
    │   ├── product/[id]/         # Product details page (magnifier lens, bespoke fit selections)
    │   ├── cart/                 # Detailed checkout bag items view
    │   ├── wishlist/             # Saved items
    │   ├── checkout/             # Payment address input & Razorpay flow trigger
    │   ├── login/ / register/    # JWT Authentication pages
    │   ├── admin/                # Backoffice views
    │   │   ├── dashboard/        # Performance trends charts & stats index
    │   │   ├── products/         # Inventory management indexes (Add/Edit/Delete products)
    │   │   └── coupons/          # Manage discount coupon campaigns
    │   └── account/              # Customer profile area (Order code tracking & statuses)
    ├── components/               # Shareable components (Navbar, Footer, CartDrawer, Logo)
    ├── context/                  # Global contexts (CartContext, Wishlist, Theme Toggle helpers)
    └── lib/                      # Core helpers (db.js - HTTP fetcher layer with token refresh)
```

### 2.2 Backend Folder Structure
```text
backend/
├── server.js                     # Express app routes, server setup, global error boundaries
├── package.json
├── config/                       # DB, Razorpay, Cloudinary, Redis & nodemailer credentials loaders
├── data/                         # Luxury seeds dataset (initialProducts, initialReviews)
├── middleware/                   # Authentication filters, DB checking, and validation error handles
├── models/                       # Mongoose collection schemas
├── services/                     # Business logic layers (AuthService, ProductService, OrderService, etc.)
└── utils/                        # Data validators (Zod validator schemas)
```

---

## 3. Database Architecture & Collections (Mongoose)

### 3.1 User Collection Schema (`User.js`)
Stores customer and administrator profile details.
```javascript
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true }, // BCrypt hashed string
  phone: { type: String },
  role: { type: String, enum: ["Customer", "Admin", "Super Admin"], default: "Customer" },
  status: { type: String, enum: ["Pending", "Active", "Suspended"], default: "Active" },
  addresses: [{
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String, default: "UAE" },
    zip: { type: String },
    phone: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  }],
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  refreshTokens: [{ type: String }] // Active refresh tokens
}, { timestamps: true });
```

### 3.2 Product Collection Schema (`Product.js`)
Stores boutique inventory data including SEO meta fields.
```javascript
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String },
  shortDescription: { type: String },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  SKU: { type: String, unique: true, index: true },
  category: { type: String, required: true },
  stock: { type: Number, default: 10 },
  sizes: [{ type: String }],
  details: [{ type: String }], // Seeding details array
  color: { type: String },
  fabric: { type: String },
  image: { type: String },
  hoverImage: { type: String },
  images: [{ type: String }],
  video: { type: String },
  featuredProduct: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date },
  seoMetadata: {
    title: { type: String },
    description: { type: String },
    keywords: { type: String }
  }
}, { timestamps: true });
```

### 3.3 Order Collection Schema (`Order.js`)
Tracks purchase transactions and fulfillment details.
```javascript
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  email: { type: String },
  id: { type: String, required: true, unique: true, index: true }, // E.g., ORD-2849-AT
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Processing", "Packed", "Shipped", "Out For Delivery", "Delivered", "Cancelled", "Returned", "Refunded"],
    default: "Pending"
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    id: { type: String },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    selectedSize: { type: String },
    image: { type: String }
  }],
  total: { type: Number, required: true },
  shippingAddress: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, default: "UAE" },
    phone: { type: String }
  },
  paymentMethod: { type: String, default: "Razorpay" },
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed", "Refunded"], default: "Pending" },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  invoiceUrl: { type: String },
  date: { type: String }
}, { timestamps: true });
```

---

## 4. API Gateway & Endpoints

### 4.1 Authentication
- **`POST /api/auth/register`**: Registers a new customer profile.
- **`POST /api/auth/login`**: Authenticates credentials and issues short-lived JWT access tokens and long-lived refresh tokens.
- **`POST /api/auth/logout`**: Revokes the current refresh token.
- **`POST /api/auth/refresh`**: Rotates tokens when the access token expires.

### 4.2 Products
- **`GET /api/products`**: Lists products. Supports query parameters for category, fabric, price ranges (`minPrice`, `maxPrice`), sorting, and text query searches.
- **`POST /api/products`**: Creates a product (Requires Admin authorization header).
- **`PUT /api/products/:id`**: Updates product details matching by MongoDB ID or slug string (Requires Admin authorization header).
- **`DELETE /api/products/:id`**: Marks the product `isDeleted: true` (Requires Admin authorization header).

### 4.3 Orders & Payments
- **`GET /api/orders`**: Retrieves customer's purchase history (or filters by guest email lookup).
- **`POST /api/orders`**: Initializes checkout and returns a valid Razorpay Order Code.
- **`PUT /api/orders/:id`**: Updates order state e.g., Shipped, Delivered (Requires Admin authorization header).
- **`POST /api/orders/:id/verify`**: Verifies signature credentials returned by Razorpay to flag orders as `Paid`.

---

## 5. Token Interceptor & Authrefresh Engine (`db.js`)
To secure calls and prevent sessions from expiring mid-use, the frontend library uses a custom wrapper around `fetch`:
1. **Header Injection**: Appends the active JWT token via `Authorization: Bearer <token>` automatically.
2. **Refresh Lifecycle**: If the API returns `401 Unauthorized`, the client makes an background `POST /api/auth/refresh` request:
   - If successful, it updates the stored token pair and retries the original request.
   - If token refresh fails, it clears local credentials and redirects the customer to log in.

---

## 6. Razorpay Payment Gateway Pipeline
```text
1. [Client] Customer clicks "Place Order" -> triggers Cart details validation.
2. [Client] fetch POST /api/orders.
3. [Server] Validates prices -> calls Razorpay SDK: razorpay.orders.create({amount, currency: "INR"}).
4. [Server] Saves order with paymentStatus: "Pending" -> returns Razorpay Order ID.
5. [Client] Opens native Razorpay payment overlay using the returning Order ID.
6. [Client] Customer authorizes payment -> Razorpay returns payment_id, order_id, signature.
7. [Client] fetch POST /api/orders/:orderCode/verify with Razorpay signature details.
8. [Server] Generates HMAC SHA256 signature using local RAZORPAY_KEY_SECRET and verifies it against the Razorpay signature.
9. [Server] If match: sets paymentStatus: "Paid", orderStatus: "Confirmed", sends confirmation receipt.
```

---

## 7. Dynamic API Route Rewriting (`next.config.mjs`)
To avoid CORS limitations in local development environments and direct endpoints correctly during deployment, client-side requests use route rewrites:
```javascript
async rewrites() {
  const isDev = process.env.NODE_ENV === "development";
  const defaultBackend = isDev ? "http://localhost:5000" : "https://abaya-backend-z5t3.onrender.com";
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || defaultBackend;
  return [
    {
      source: "/api/:path*",
      destination: `${backendUrl}/api/:path*`,
    },
  ];
}
```
All API calls from the client can reference relative routes (e.g. `fetch('/api/products')`), which Next.js resolves correctly on the server side.
