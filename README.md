# E-Waiter Admin Page

A modern admin dashboard for managing restaurants, menus, and orders with Firebase integration.

## Features

- 🔐 **Firebase Authentication** - Secure login system
- 🗄️ **Firestore Database** - Real-time data management
- 📁 **Firebase Storage** - File upload and management
- 📊 **Admin Dashboard** - Overview of restaurants, menus, and orders
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Real-time Updates** - Live data synchronization

## Firebase Services Used

- **Authentication**: User login/signup
- **Firestore**: Database for restaurants, menus, orders
- **Storage**: Image uploads for restaurants and menu items
- **Analytics**: Usage tracking

## Setup Instructions

### 1. Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project (already configured)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/AppLabStudios/e-waiter-admin-page.git

# Navigate to project directory
cd e-waiter-admin-page

# Install dependencies
npm install
```

### 3. Firebase Configuration

The Firebase configuration is already set up in `src/firebase.js` with your project details:

- Project ID: `e-waiter-e5747`
- Auth Domain: `e-waiter-e5747.firebaseapp.com`
- Storage Bucket: `e-waiter-e5747.firebasestorage.app`

### 4. Firebase Console Setup

Make sure to enable these services in your Firebase Console:

1. **Authentication**
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication

2. **Firestore Database**
   - Go to Firestore Database
   - Create database in test mode (for development)
   - Set up security rules

3. **Storage**
   - Go to Storage
   - Initialize storage
   - Set up security rules

### 5. Security Rules

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 6. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### Authentication

1. **Login**: Use your Firebase authentication credentials
2. **Create Account**: Use the signup functionality (if implemented)
3. **Logout**: Click the logout button in the dashboard

### Dashboard Features

- **Statistics**: View counts of restaurants, menu items, and orders
- **Recent Orders**: See the latest 5 orders with their status
- **Restaurants**: View all registered restaurants

### Firebase Utilities

The project includes comprehensive utility functions in `src/firebaseUtils.js`:

#### Authentication
```javascript
import { signInUser, createUser, signOutUser } from './firebaseUtils';

// Login
const result = await signInUser(email, password);

// Create user
const result = await createUser(email, password, displayName);

// Logout
await signOutUser();
```

#### Firestore Operations
```javascript
import { addRestaurant, getRestaurants, updateRestaurant } from './firebaseUtils';

// Add restaurant
const result = await addRestaurant({
  name: "Restaurant Name",
  address: "Restaurant Address",
  phone: "123-456-7890"
});

// Get all restaurants
const result = await getRestaurants();

// Update restaurant
await updateRestaurant(restaurantId, { name: "New Name" });
```

#### Storage Operations
```javascript
import { uploadRestaurantImage, uploadMenuItemImage } from './firebaseUtils';

// Upload restaurant image
const result = await uploadRestaurantImage(file, restaurantId);

// Upload menu item image
const result = await uploadMenuItemImage(file, itemId);
```

## Project Structure

```
src/
├── firebase.js              # Firebase configuration
├── firebaseUtils.js         # Firebase utility functions
├── contexts/
│   └── AuthContext.jsx      # Authentication context
├── App.jsx                  # Main application component
├── App.css                  # Styles
└── main.jsx                 # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email youssef.azroun.applab@gmail.com or create an issue in the repository.
