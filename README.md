# 🚌 Bus Booking App

A modern **Progressive Web App (PWA)** for booking bus tickets across Sri Lanka. Built using **Vue 3**, **Vite**, **Firebase**, and **Tailwind CSS**, this system allows users to search buses, select seats, make payments, receive email confirmations, and download PDF e-tickets with QR codes.

 Woreking link is - [Webb App link](https://busbookingapp-31c91.web.app/)
---

## 🚀 Features

### 👤 User Features

* User Registration & Login (Firebase Authentication)
* Email Verification
* Search buses by route & date
* Seat selection system
* Secure payment flow (Card / Mobile / Bank Transfer)
* Booking history
* Email booking confirmation
* PDF ticket generation (QR Code + Barcode)
* Progressive Web App (Add to Home Screen)

### 🛠 Admin / System Features

* Firestore real-time database
* Secure user-based bookings
* Booking status management (CONFIRMED / PENDING)
* Firebase Hosting ready

---

## 🧰 Tech Stack

| Category   | Technology                     |
| ---------- | ------------------------------ |
| Frontend   | Vue 3 (Composition API)        |
| Build Tool | Vite                           |
| Styling    | Tailwind CSS                   |
| Backend    | Firebase (Auth + Firestore)    |
| Email      | EmailJS / Custom Email Service |
| PDF        | jsPDF                          |
| QR Code    | qrcode                         |
| Barcode    | JsBarcode                      |
| PWA        | Vite PWA Plugin                |

---

## 📱 Progressive Web App (PWA)

* Installable on Android & Desktop
* Offline-ready
* App-like full screen mode

---

## 📸 Screenshots

> *(Add screenshots here)*

* Home Page
* Seat Selection
* Payment Page
* Booking History
* PDF Ticket

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/drjjonathan1015/bus-booking-app.git
cd bus-booking-app
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Firebase Configuration

Create a Firebase project and enable:

* Authentication (Email/Password)
* Firestore Database

Create a `.env` file:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4️⃣ Run Development Server

```bash
npm run dev
```

---

## 🏗 Build for Production

```bash
npm run build
```

---

## 🌐 Deployment

### Firebase Hosting (Recommended)

```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

---

## 📂 Project Structure

```
src/
├── assets/
├── components/
├── views/
├── services/
├── firebase/
├── router/
├── App.vue
└── main.js
```

---

## 🧠 Future Enhancements

* Admin dashboard
* Real-time seat locking
* Online payment gateway integration
* SMS notifications
* Multi-language support

---

## 👨‍💻 Author

**G.D. Jonathan**
🎓 BSc (Hons) Computer Science – SEUSL
📍 Sri Lanka

---

## 📄 License

This project is for **educational purposes**. Feel free to fork and enhance.

---

✨ *Thank you for checking out this project!*
