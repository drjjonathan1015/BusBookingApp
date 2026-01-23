# 🚌 Bus Booking System - Complete Documentation

## Project Overview
A comprehensive bus booking system built with Vue.js 3, Firebase, and Tailwind CSS that allows users to book bus seats and bus owners to manage their fleet.

## Features Implemented

### 1. User Registration & Authentication
- **Customer Registration**: Name, email, mobile number, password with OTP verification
- **Bus Owner Registration**: Separate registration for bus service owners with company details
- **Login System**: Email and password authentication
- **OTP Verification**: Mobile number verification during registration

### 2. Bus Search & Booking
- Search buses by date and route
- View available buses with real-time seat availability
- Interactive seat selection with visual bus layout
- Price calculation based on selected seats
- Booking confirmation with passenger details

### 3. E-Ticket & SMS Notifications
- Automatic e-ticket generation (PDF) upon booking
- Instant download after successful booking
- SMS confirmation sent to registered mobile number
- E-ticket includes all journey and passenger details

### 4. Booking History
- View all past bookings
- Download e-tickets anytime
- Visual seat map for each booking
- Booking status tracking

### 5. Admin Panel (Bus Owners)
- Add new buses with route, schedule, and pricing
- View and manage all buses
- Track seat availability in real-time
- View booking statistics and revenue
- Delete buses

## Tech Stack

- **Frontend**: Vue.js 3 (Composition API & Options API)
- **Backend**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Styling**: Tailwind CSS
- **PDF Generation**: jsPDF
- **Routing**: Vue Router

## Installation & Setup

### Prerequisites
```bash
Node.js (v16 or higher)
npm or yarn
Firebase account
```

### Step 1: Clone and Install
```bash
git clone <your-repo-url>
cd bus-booking-system
npm install
```

### Step 2: Install Dependencies
```bash
npm install vue@latest
npm install vue-router@latest
npm install firebase
npm install jspdf
npm install -D tailwindcss@latest
```

### Step 3: Firebase Configuration
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Update `src/firebase/index.js` with your Firebase config

### Step 4: Firestore Database Structure

#### Collections:

**users**
```javascript
{
  uid: "user-id",
  name: "John Doe",
  email: "john@example.com",
  mobile: "+94771234567",
  role: "customer" | "bus_owner" | "admin",
  createdAt: Timestamp
}
```

**buses**
```javascript
{
  id: "bus-id",
  busNo: "NC-1234",
  route: "Colombo to Kandy",
  totalSeats: 40,
  seatsAvailable: 35,
  price: 500,
  date: Timestamp,
  time: "08:00 AM",
  ownerId: "owner-user-id",
  bookedSeats: [],
  createdAt: Timestamp
}
```

**bookings**
```javascript
{
  id: "booking-id",
  userId: "user-id",
  busId: "bus-id",
  seats: [1, 2, 3],
  totalAmount: 1500,
  busRoute: "Colombo to Kandy",
  busNo: "NC-1234",
  date: Timestamp,
  time: "08:00 AM",
  passengerName: "John Doe",
  passengerEmail: "john@example.com",
  passengerMobile: "+94771234567",
  status: "confirmed",
  timestamp: Timestamp
}
```

### Step 5: Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Buses collection
    match /buses/{busId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'bus_owner'];
      allow update, delete: if request.auth != null && 
                            resource.data.ownerId == request.auth.uid;
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if request.auth != null && 
                     (resource.data.userId == request.auth.uid || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'bus_owner']);
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### Step 6: Run the Application
```bash
npm run dev
```

## User Workflows

### Customer Journey
1. **Register** → Fill registration form with OTP verification
2. **Login** → Use email and password
3. **Search Buses** → Select date and route
4. **Select Bus** → Click "Book Now" on desired bus
5. **Choose Seats** → Interactive seat selection
6. **Confirm Booking** → Review and confirm
7. **Get Confirmation** → SMS + E-ticket download
8. **View History** → Access all bookings and re-download tickets

### Bus Owner Journey
1. **Register as Bus Owner** → Special registration form
2. **Login** → Use credentials
3. **Access Admin Panel** → Navigate to admin dashboard
4. **Add Buses** → Enter bus details (number, route, schedule, price)
5. **Manage Fleet** → View all buses, track bookings
6. **View Statistics** → Monitor revenue and bookings

## File Structure
```
src/
├── components/
│   ├── AdminPanel.vue          # Bus owner dashboard
│   ├── AdminRegister.vue       # Bus owner registration
│   ├── BusList.vue            # Search and display buses
│   ├── BookingHistory.vue     # User's booking history
│   ├── Login.vue              # Login page
│   ├── Register.vue           # Customer registration
│   └── SeatSelection.vue      # Interactive seat booking
├── firebase/
│   ├── index.js              # Firebase config
│   └── db.js                 # Firestore instance
├── router.js                  # Vue Router configuration
├── App.vue                    # Main app component
├── main.js                    # App entry point
└── main.css                   # Tailwind styles
```

## SMS Integration (Production)

For production, integrate with SMS gateway:

```javascript
// Example with Twilio
import twilio from 'twilio';

const sendSMS = async (mobile, message) => {
  const client = twilio(accountSid, authToken);
  
  await client.messages.create({
    body: message,
    from: '+1234567890', // Your Twilio number
    to: mobile
  });
};
```

Or use Sri Lankan SMS providers like:
- Dialog SMS API
- Mobitel SMS Gateway
- Hutch SMS Services

## Key Features Explained

### OTP Verification
- 6-digit OTP generated during registration
- Validates mobile number ownership
- In demo: OTP shown in alert (replace with SMS API)

### Seat Selection System
- 40-seat bus layout (2-2 seating + 5 back row)
- Real-time seat availability
- Color-coded: Red (booked), Green (selected), White (available)
- Interactive click-to-select

### E-Ticket Generation
- Professional PDF format
- Includes passenger & journey details
- Booking ID for reference
- Instant download

### Admin Authorization
- Role-based access control
- Only bus_owner/admin roles can access admin panel
- Owner can only manage their own buses

## Environment Variables (Optional)
Create `.env` file:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

## Production Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Future Enhancements
- [ ] Payment gateway integration (Stripe, PayPal, local banks)
- [ ] Real-time seat updates using WebSockets
- [ ] Email notifications
- [ ] QR code on e-tickets
- [ ] Multi-language support
- [ ] Mobile app (React Native/Flutter)
- [ ] Bus tracking (GPS integration)
- [ ] Reviews and ratings
- [ ] Cancellation and refund system
- [ ] Promotional offers and discounts

## Troubleshooting

### Common Issues

**Firebase connection errors**
- Check internet connection
- Verify Firebase config in `firebase/index.js`
- Ensure Firestore rules allow read/write

**OTP not working**
- Integrate actual SMS gateway for production
- Currently shows OTP in console/alert

**Routes not working**
- Check Vue Router configuration
- Ensure all components are imported correctly

**Styling issues**
- Run `npm install -D tailwindcss`
- Check `main.css` imports Tailwind directives

## Support & Contact
For issues or questions, please open an issue on GitHub.

## License
MIT License - feel free to use for personal or commercial projects.

---
Built with ❤️ for Sri Lankan bus services