# Abaya By Tabassum — Website Mindmap & User Flow

This document outlines the visual structure and user flow of the **Abaya by Tabassum** platform, showcasing the entry points, the functional branches for both **Customers** and **Administrators**, and how the frontend interacts with the standalone backend.

---

## System Flow Diagram

The following diagram maps the user journey starting from the main authentication screen:

```mermaid
graph TD
    %% Base Authentication Entry
    Start([User Visits Website]) --> AuthCheck{Is Authenticated?}
    
    AuthCheck -- No --> AuthPages[Authentication Gate]
    AuthPages --> Login[Login Page]
    AuthPages --> Register[Registration Page]
    
    Register --> |Fills Credentials| Verification[Email Sent: Verify Link]
    Verification --> |Clicks Link| Login
    
    Login --> |Logs In| RoleCheck{Determine User Role}
    AuthCheck -- Yes --> RoleCheck

    %% Customer Experience Branch
    RoleCheck --> |Role: Customer / Guest| CustomerFlow[Storefront & Client Area]
    
    CustomerFlow --> Home[Home Page / Welcome Banner]
    CustomerFlow --> EBoutique[E-Boutique / Shop]
    CustomerFlow --> Lookbook[Lookbook Gallery]
    
    EBoutique --> ProductDetail[Product Detail Page]
    ProductDetail --> Review[Write reviews / view ratings]
    ProductDetail --> Cart[Add to Shopping Bag]
    
    Cart --> Checkout[Checkout Page]
    Checkout --> CouponValidation{Validate Coupon?}
    CouponValidation --> |Apply ATELIER10 / MODESTY| Discount[Discount Calculated]
    CouponValidation --> |No Coupon| FinalTotal[Calculate Final Total]
    
    Discount --> PaymentGateway[Razorpay Payment Integration]
    FinalTotal --> PaymentGateway
    
    PaymentGateway --> |Successful Payment| OrderReceipt[Order Placed & Confirmation Email Sent]
    OrderReceipt --> CustomerDashboard[Customer Dashboard / Order History]
    
    %% Administration Console Branch
    RoleCheck --> |Role: Admin / Super Admin| AdminConsole[Atelier Management Console]
    
    AdminConsole --> AdminOverview[Overview Dashboard]
    AdminConsole --> AdminInventory[Lookbook Inventory]
    AdminConsole --> AdminOrders[Incoming Orders]
    AdminConsole --> AdminPromos[Promo Management]
    AdminConsole --> AdminReviews[Customer Feedback Review]
    
    AdminOverview --> |View Real-Time Metrics| Stats[Revenue, Order Count, Promo stats]
    
    AdminInventory --> |Action: Add Product| CreateProd[Create new hand-tailored items]
    AdminInventory --> |Action: Soft Delete| DeleteProd[Hide/Delete product from storefront]
    
    AdminOrders --> |Action: Update Status| StitchingStatus[Processing / In Stitching / Shipped / Delivered]
    StitchingStatus --> |Triggers Update Email| CustomerNotification[Send Mail to Client]
    
    AdminPromos --> |Action: Create Promo| NewCoupon[Configure Discount Percent & Code]

    %% Styling
    classDef auth fill:#1a1c23,stroke:#d4af37,stroke-width:1px,color:#fff;
    classDef customer fill:#0b0c10,stroke:#888,stroke-width:1px,color:#c5c6c7;
    classDef admin fill:#0b0c10,stroke:#d4af37,stroke-width:2px,color:#d4af37;
    
    class Start,AuthCheck,AuthPages,Login,Register,Verification,RoleCheck auth;
    class CustomerFlow,Home,EBoutique,Lookbook,ProductDetail,Review,Cart,Checkout,CouponValidation,Discount,FinalTotal,PaymentGateway,OrderReceipt,CustomerDashboard customer;
    class AdminConsole,AdminOverview,AdminInventory,AdminOrders,AdminPromos,AdminReviews,Stats,CreateProd,DeleteProd,StitchingStatus,CustomerNotification,NewCoupon admin;
```

---

## Role-Based Feature Map

| Feature Area | Customer Capabilities | Administrator / Super Admin Capabilities |
| :--- | :--- | :--- |
| **Authentication** | Register an account, log in, verify email, reset forgotten password. | Log in to access the secure administrative workspace. |
| **Storefront** | Browse products, search collections, view lookbooks, view rating details. | Pre-view active products; add products; soft-delete existing products. |
| **Order Flow** | Add items to shopping cart, validate coupons, pay via Razorpay. | View all incoming orders, update status (Stitching, Shipped, Delivered). |
| **Reviews** | Write a review with star ratings (1-5) and comments. | Review and inspect customer feedback comments. |
| **Notifications** | Receive order receipt emails, shipping notifications, and password resets. | Send email updates automatically through status changes. |
