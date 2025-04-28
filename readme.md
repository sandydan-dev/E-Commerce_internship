# E-Commerce Backend Project

- *COMPANY* : CODETECH IT SOLUTIONS
- *NAME* : Sandeep Dhanwate
- *INTERN ID* : CT06DA679
- *DOMAIN* : Backend Web Development
- *DURATION* : 6 WEEK
- *MENTOR* : NEELA SANTOSH


This is a backend project for an e-commerce platform built using Node.js and Express. It includes features like user authentication, role-based access control, product management, order management, seller profiles, and review systems. The project is designed to handle different roles such as customers, sellers, and admins, each having specific access to different resources in the system.

## Features

1. **User Authentication:**
   - Users can register, log in, and log out.
   - Passwords are securely hashed and JWT tokens are used for user sessions.
   - Email verification during user registration.

2. **Role-based Access:**
   - There are three roles: **admin**, **seller**, and **customer**.
   - **Admin** can manage sellers, products, and view all users' data.
   - **Sellers** can add, update, and delete their products, and manage their profiles.
   - **Customers** can browse products, place orders, and write reviews.

3. **Product Management:**
   - Sellers can add products with images, set prices, stock, and update product details.
   - Products can be filtered by category and price range.
   - Admins can approve or reject products.

4. **Order Management:**
   - Customers can place orders for products.
   - Admin can view all orders, and sellers can see orders related to their products.

5. **Seller Profiles:**
   - Sellers must create a profile, which includes details about their shop.
   - Admins can verify the seller’s profile.

6. **Reviews & Ratings:**
   - Customers can write reviews and rate products.
   - Admin can manage reviews and delete inappropriate ones.

7. **Email Notifications:**
   - Used for actions like user registration and password resets.

8. **Rate Limiting:**
   - Protects endpoints by limiting the number of requests from a user in a specified time window to avoid abuse.


## New user register/signup
![Image](https://github.com/user-attachments/assets/d1e0de90-7bd3-46f2-bf23-a73a07f8ddd9)

## Login User
![Image](https://github.com/user-attachments/assets/a008f909-9658-4ccd-8644-0b40b15a7e4a)

## New product create
![Image](https://github.com/user-attachments/assets/f0752fde-9bbe-4317-b03b-6798b232ee08)

## Product List
![Image](https://github.com/user-attachments/assets/3d09bfd6-af12-49b3-b02b-c15106b1e0ef)

## Order create
![Image](https://github.com/user-attachments/assets/f89c3406-777e-4c54-aacc-78863bbed55a)

## Seller Profile
![Image](https://github.com/user-attachments/assets/87bb03cd-4b21-424d-9b87-0f7ee8088aee)

## All Order list
![Image](https://github.com/user-attachments/assets/f88e60f0-3370-452f-aba1-38b555477efd)

## Create review for product
![Image](https://github.com/user-attachments/assets/9417c595-ca2c-421e-a7e0-010c0ca5eadf)

## Install dependencies:
npm install


## Configuration

Create a `.env` file in the root directory and add your environment variables like the following:

```env
# JWT Authentication
JWT_SECRET_KEY=your_jwt_secret_key

# Email SMTP Configuration
MAIL_HOST=your_smtp_host
MAIL_PORT=your_smtp_port
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_email_password
USER=your_email


# Run the application:
npm start


The server will run on http://localhost:4000



# API Endpoints

## User Routes

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/v1/user/register` | Register a new user |
| POST | `/api/v1/user/login` | Login an existing user |
| GET  | `/api/v1/user/verify-email` | Verify the user’s email after registration |
| POST | `/api/v1/user/logout` | Log out the user |
| POST | `/api/v1/user/forgot-password` | Request a password reset link |
| POST | `/api/v1/user/reset-password` | Reset the user’s password |

## Admin Routes

| Method | Endpoint | Description |
|--------|---------|-------------|
| PUT  | `/api/v1/admin/verify-seller/:id` | Admin verifies a seller's profile |
| GET  | `/api/v1/admin/seller-not-verified` | View sellers who haven't been verified |
| GET  | `/api/v1/admin/seller-verified` | View verified sellers |

## Product Routes

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST  | `/api/v1/products/create` | Create a new product |
| GET   | `/api/v1/products/data` | View all products |
| GET   | `/api/v1/products/data/:id` | View a single product by ID |
| PATCH | `/api/v1/products/update/:id` | Update a product's details |
| DELETE | `/api/v1/products/delete/:id` | Delete a product by ID |
| GET   | `/api/v1/products/category` | Filter products by category |
| PATCH | `/api/v1/products/update-status/:id` | Update product status |
| GET   | `/api/v1/products/search` | Search and filter products based on price, category, etc. |

## Review Routes

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST  | `/api/v1/reviews/create/:id` | Create a product review |
| GET   | `/api/v1/reviews/data` | View all reviews |
| PATCH | `/api/v1/reviews/update/:id` | Update a review |
| DELETE | `/api/v1/reviews/delete/:id` | Delete a review |

## Seller Routes

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST  | `/api/v1/seller/profile` | Create a seller profile |
| PUT   | `/api/v1/seller/update/:id` | Update the seller’s profile |

## Order Routes

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST  | `/api/v1/order/create` | Create a new order |
| GET   | `/api/v1/order/data` | Get all user orders |
| GET   | `/api/v1/order/data/:id` | Get a specific order by ID |





# Technologies Used

This project is built using the following technologies:

### **Backend Framework & Runtime**
- **Node.js** – JavaScript runtime for executing backend logic.
- **Express.js** – Web framework for handling routing, middleware, and requests efficiently.

### **Database & Data Modeling**
- **MongoDB** – NoSQL database for storing user profiles, products, and orders.
- **Mongoose** – ODM (Object Data Modeling) library to simplify MongoDB interactions.

### **Authentication & Security**
- **JWT (JSON Web Token)** – Secure user authentication and session management.
- **Bcrypt** – Password hashing for enhanced security.
- **Rate Limiting** – Prevents excessive API requests and potential abuse.

### **File Handling & Media Uploads**
- **Multer** – Middleware for handling file uploads (e.g., product images, seller logos).

### **Email & Notifications**
- **Nodemailer** – Sends emails for actions like account verification and password resets.

This structured breakdown enhances readability and makes it easier for developers to quickly understand the stack used in the project. Would you like any additional details included?


License
This project is licensed under the MIT License - see the LICENSE file for details.



### Key Points:

- This project focuses on building an e-commerce backend with the features typically needed for handling products, orders, users, and reviews.
- It uses technologies like Node.js, Express, MongoDB, JWT, Bcrypt, and Multer to handle user authentication, product management, file uploads, email sending, and rate limiting.
- The project is modular, separating responsibilities for different features (e.g., user authentication, product management) into controllers and routes.

This `README.md` explains your project clearly, covering installation, features, and usage in a concise way. Let me know if you'd like to add or modify anything!


