# Authentication API Documentation

## Overview
This API uses JWT (JSON Web Tokens) for authentication. All protected endpoints require a valid token in the `Authorization` header.

## Authentication Endpoints

### 1. Register User
**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "confirmPassword": "securepassword123",
  "name": "John Doe",
  "phone": "08123456789",
  "address": "123 Main St"
}
```

**Response (200):**
```json
{
  "message": "Registrasi berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

### 2. Login User
**POST** `/api/auth/login`

Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

### 3. Get Profile
**GET** `/api/auth/profile`

Get current user profile. Requires authentication.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "08123456789",
  "address": "123 Main St",
  "role": "USER",
  "createdAt": "2026-06-08T10:30:00Z"
}
```

### 4. Update Profile
**PUT** `/api/auth/profile`

Update user profile information. Requires authentication.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "phone": "08987654321",
  "address": "456 Oak Ave"
}
```

**Response (200):**
```json
{
  "message": "Profil berhasil diperbarui",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Jane Doe",
    "phone": "08987654321",
    "address": "456 Oak Ave",
    "role": "USER"
  }
}
```

### 5. Change Password
**PUT** `/api/auth/change-password`

Change user password. Requires authentication.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456",
  "confirmPassword": "newpassword456"
}
```

**Response (200):**
```json
{
  "message": "Password berhasil diubah"
}
```

## Protected Endpoints (Require Authentication)

### Create Order
**POST** `/api/orders`

Headers:
```
Authorization: Bearer <token>
```

### Get User Orders
**GET** `/api/users/:userId/orders`

Headers:
```
Authorization: Bearer <token>
```

### Get Order Details
**GET** `/api/orders/:orderId`

Headers:
```
Authorization: Bearer <token>
```

### Admin Only: Update Order Status
**PATCH** `/api/orders/:orderId/status`

Headers:
```
Authorization: Bearer <token>
```

### Admin Only: Get All Users
**GET** `/api/admin/users`

Headers:
```
Authorization: Bearer <token>
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Email, password, dan name wajib diisi"
}
```

### 401 Unauthorized
```json
{
  "message": "Token tidak ditemukan"
}
```

### 403 Forbidden
```json
{
  "message": "Akses hanya untuk admin"
}
```

### 409 Conflict
```json
{
  "message": "Email sudah terdaftar"
}
```

## Token Usage

After login or register, you'll receive a JWT token. Include it in all protected requests:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:4000/api/auth/profile
```

## Token Expiration

Tokens expire after 7 days (configurable via `JWT_EXPIRES_IN` in `.env`). When expired:

```json
{
  "message": "Token sudah kadaluarsa"
}
```

You'll need to login again to get a new token.

## User Roles

- **USER**: Regular user (default role)
- **ADMIN**: Administrator (can manage all orders and users)

Only admins can:
- Update order status
- View all users
- View all orders

## Best Practices

1. Store the token securely (e.g., httpOnly cookie or secure storage)
2. Always use HTTPS in production
3. Never expose tokens in URLs
4. Change `JWT_SECRET` in production
5. Implement token refresh mechanism for long-lived sessions
