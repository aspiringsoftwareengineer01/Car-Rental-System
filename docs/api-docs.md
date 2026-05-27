# API Documentation 🔌

This document specifies the RESTful API endpoints for the Car Rental System, outlining request structures, response formats, and status codes.

## Base URL
- Local: `http://localhost:5000/api/v1`
- Production: `https://api.antigravity-rentals.com/api/v1`

---

## 🔐 Authentication Endpoints

### 1. Register User
`POST /auth/register` - Register a new customer or admin account.

- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123!",
    "phone": "+1234567890"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user": {
      "id": "u_987654",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "customer"
    }
  }
  ```

### 2. Login User
`POST /auth/login` - Obtain JWT access token.

- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "Password123!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "u_987654",
      "name": "Jane Doe",
      "role": "customer"
    }
  }
  ```

---

## 🚗 Car Inventory Endpoints

### 1. List All Cars
`GET /cars` - Retrieve a filtered list of available rental cars.

- **Query Parameters**:
  - `status`: `available`, `rented`, `maintenance` (optional)
  - `type`: `SUV`, `Sedan`, `Electric`, `Sports` (optional)
  - `minPrice`: Number (optional)
  - `maxPrice`: Number (optional)

- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": 2,
    "cars": [
      {
        "id": "c_101",
        "make": "Tesla",
        "model": "Model S",
        "type": "Electric",
        "pricePerDay": 120.00,
        "transmission": "Automatic",
        "seats": 5,
        "status": "available",
        "imageUrl": "/assets/tesla-s.png"
      },
      {
        "id": "c_102",
        "make": "Porsche",
        "model": "911 Carrera",
        "type": "Sports",
        "pricePerDay": 250.00,
        "transmission": "Automatic",
        "seats": 4,
        "status": "available",
        "imageUrl": "/assets/porsche-911.png"
      }
    ]
  }
  ```

### 2. Get Car Details
`GET /cars/:id` - Fetch details for a specific car.

- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "car": {
      "id": "c_101",
      "make": "Tesla",
      "model": "Model S",
      "type": "Electric",
      "pricePerDay": 120.00,
      "transmission": "Automatic",
      "seats": 5,
      "status": "available",
      "specs": {
        "range": "405 miles",
        "acceleration": "0-60 mph in 3.1s",
        "autopilot": true
      }
    }
  }
  ```

---

## 📅 Booking Endpoints

### 1. Create a Booking
`POST /bookings` - Book a car for a specified date range. *(Requires Authentication Token)*

- **Request Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "carId": "c_101",
    "startDate": "2026-06-01",
    "endDate": "2026-06-05"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "booking": {
      "id": "b_554433",
      "userId": "u_987654",
      "carId": "c_101",
      "startDate": "2026-06-01",
      "endDate": "2026-06-05",
      "totalPrice": 480.00,
      "status": "confirmed",
      "createdAt": "2026-05-27T16:20:00Z"
    }
  }
  ```

### 2. Cancel a Booking
`POST /bookings/:id/cancel` - Cancel a pending or confirmed booking. *(Requires Authentication Token)*

- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Booking cancelled successfully",
    "booking": {
      "id": "b_554433",
      "status": "cancelled"
    }
  }
  ```

---

## 🛠️ Error Codes Standard

The API uses standard HTTP response codes coupled with JSON error bodies:

| Status Code | Description | Example Reason |
| :--- | :--- | :--- |
| `400 Bad Request` | Missing parameters or invalid inputs | `End date must be after start date` |
| `401 Unauthorized` | Invalid or expired authentication token | `Access token is invalid or expired` |
| `403 Forbidden` | Access to resources is blocked for the user role | `Requires admin permissions` |
| `404 Not Found` | Requested resource does not exist | `Car with ID c_999 not found` |
| `409 Conflict` | Overlapping booking dates or duplicate record | `Car is already booked during these dates` |
| `500 Server Error` | Unexpected backend server issues | `Database connection timeout` |
