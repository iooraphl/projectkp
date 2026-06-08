# Frontend Authentication Setup Guide

## Installation

First, install the required dependencies:

```bash
npm install react-router-dom
```

## Integration with App.jsx

Update your `src/main.jsx` to include the router and auth provider:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import App from './App.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
```

Update your `src/App.jsx` to include routes:

```jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import Register from './components/Register'
import ProtectedRoute from './components/ProtectedRoute'
import UserProfile from './components/UserProfile'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import ProductSection from './components/ProductSection'
import CartSection from './components/CartSection'
import CheckoutSection from './components/CheckoutSection'

export default function App() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        
        <Route path="/" element={
          <>
            <HeroSection />
            <ProductSection />
          </>
        } />
        
        <Route path="/cart" element={
          <ProtectedRoute>
            <CartSection />
          </ProtectedRoute>
        } />
        
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutSection />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}
```

## Component Structure

### AuthContext
Manages global authentication state including:
- User data
- JWT token
- Login/Register/Logout methods
- Profile update methods
- Password change methods

**Usage:**
```jsx
const { user, isAuthenticated, login, logout, token } = useAuth()
```

### Login Component
- Email and password input
- Error handling
- Loading states
- Redirect to home on success

### Register Component
- Email, password, name, phone, address fields
- Password confirmation
- Error handling
- Redirect to home on success

### UserProfile Component
- View/edit profile information
- Change password functionality
- Two-tab interface for profile and password

### ProtectedRoute Component
- Wraps routes that require authentication
- Redirects unauthenticated users to login
- Optional admin role check
- Loading state handling

## Header Component Update

Add authentication buttons to your Header component:

```jsx
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="header">
      {/* Your logo and navigation */}
      <div className="auth-buttons">
        {isAuthenticated ? (
          <>
            <Link to="/profile">{user?.name}</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  )
}
```

## Environment Variables

Make sure your `.env` has:
```
VITE_API_BASE_URL=http://localhost:4000
```

## Flow Diagram

```
User visits /login or /register
        ↓
User submits form
        ↓
AuthContext sends request to backend
        ↓
Backend validates & returns JWT token
        ↓
Token stored in localStorage
        ↓
User state updated in AuthContext
        ↓
User redirected to home page
        ↓
Protected routes now accessible
```

## Features

✅ **Registration**
- Email validation
- Password strength (min 6 chars)
- Password confirmation match
- Optional phone and address

✅ **Login**
- Email and password
- Error handling for invalid credentials
- Token stored securely

✅ **Protected Routes**
- Auto-redirect to login if not authenticated
- Admin role checking
- Loading states

✅ **Profile Management**
- View user information
- Update name, phone, address
- Change password
- Success/error messages

✅ **Token Management**
- Auto-stored in localStorage
- Auto-restored on app reload
- Sent with all API requests
- 7-day expiration

## Security Notes

1. **Token Storage**: Currently stored in localStorage. For better security in production:
   - Use httpOnly cookies
   - Implement token refresh mechanism
   - Add CSRF protection

2. **API Requests**: Token automatically included in `Authorization: Bearer <token>` header

3. **Password**: Hashed on backend with bcryptjs (10 salt rounds)

4. **Validation**: Both frontend and backend validation

## API Endpoints Used

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/register` | POST | ❌ | Register new user |
| `/api/auth/login` | POST | ❌ | User login |
| `/api/auth/profile` | GET | ✅ | Get user profile |
| `/api/auth/profile` | PUT | ✅ | Update profile |
| `/api/auth/change-password` | PUT | ✅ | Change password |

## Troubleshooting

**Issue**: Token not being sent to API
- Check if `VITE_API_BASE_URL` is set correctly
- Verify token is stored in localStorage

**Issue**: User stays logged in after page refresh
- Token is restored from localStorage automatically
- Check browser localStorage in DevTools

**Issue**: Login works but redirect doesn't happen
- Check if routes are defined in App.jsx
- Ensure BrowserRouter is wrapping the app

**Issue**: Protected routes not working
- Verify ProtectedRoute component is used correctly
- Check AuthProvider wraps the entire app
- Ensure useAuth hook is being called
