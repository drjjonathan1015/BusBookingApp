<template>
  <div class="max-w-2xl mx-auto mt-6 sm:mt-10 px-4 pb-8">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-blue-600 dark:text-blue-400 transition-colors">
      💳 Complete Payment
    </h1>

    <!-- Booking Summary -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6 transition-colors">
      <h2 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4">Booking Summary</h2>
      
      <div class="space-y-2 text-sm sm:text-base">
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Route:</span>
          <span class="font-semibold text-gray-800 dark:text-white">{{ bookingData.busRoute || 'N/A' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Bus No:</span>
          <span class="font-semibold text-gray-800 dark:text-white">{{ bookingData.busNo || 'N/A' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Date:</span>
          <span class="font-semibold text-gray-800 dark:text-white">{{ bookingData.date || 'N/A' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Time:</span>
          <span class="font-semibold text-gray-800 dark:text-white">{{ bookingData.time || 'N/A' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Seats:</span>
          <span class="font-semibold text-gray-800 dark:text-white">{{ bookingData.seats?.join(', ') || 'N/A' }}</span>
        </div>
        <div class="border-t dark:border-gray-600 pt-2 mt-2">
          <div class="flex justify-between text-base sm:text-lg">
            <span class="font-bold text-gray-800 dark:text-white">Total Amount:</span>
            <span class="font-bold text-green-600 dark:text-green-400">Rs {{ bookingData.totalAmount || 0 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Method Selection -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6 transition-colors">
      <h2 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4">Select Payment Method</h2>
      
      <div class="space-y-3">
        <label class="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-700"
               :class="paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'">
          <input type="radio" v-model="paymentMethod" value="card" class="mr-3" />
          <div class="flex items-center gap-3 flex-1">
            <span class="text-xl sm:text-2xl">💳</span>
            <div class="flex-1">
              <div class="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">Credit/Debit Card</div>
              <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Visa, Mastercard, Amex</div>
            </div>
          </div>
        </label>

        <label class="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-700"
               :class="paymentMethod === 'mobile' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'">
          <input type="radio" v-model="paymentMethod" value="mobile" class="mr-3" />
          <div class="flex items-center gap-3 flex-1">
            <span class="text-xl sm:text-2xl">📱</span>
            <div class="flex-1">
              <div class="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">Mobile Payment</div>
              <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Dialog, Mobitel, Hutch</div>
            </div>
          </div>
        </label>

        <label class="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-700"
               :class="paymentMethod === 'bank' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'">
          <input type="radio" v-model="paymentMethod" value="bank" class="mr-3" />
          <div class="flex items-center gap-3 flex-1">
            <span class="text-xl sm:text-2xl">🏦</span>
            <div class="flex-1">
              <div class="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">Bank Transfer</div>
              <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Online Banking</div>
            </div>
          </div>
        </label>
      </div>
    </div>

    <!-- Card Payment Form -->
    <div v-if="paymentMethod === 'card'" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6 transition-colors">
      <h3 class="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-4">Card Details</h3>
      
      <div class="space-y-3 sm:space-y-4">
        <div>
          <label class="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Card Number</label>
          <input
            v-model="cardDetails.number"
            type="text"
            placeholder="1234 5678 9012 3456"
            maxlength="19"
            class="w-full border dark:border-gray-600 p-2 sm:p-3 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
          />
        </div>
        <div>
          <label class="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Cardholder Name</label>
          <input
            v-model="cardDetails.name"
            type="text"
            placeholder="John Doe"
            class="w-full border dark:border-gray-600 p-2 sm:p-3 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
          />
        </div>
        <div class="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label class="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Expiry Date</label>
            <input
              v-model="cardDetails.expiry"
              type="text"
              placeholder="MM/YY"
              maxlength="5"
              class="w-full border dark:border-gray-600 p-2 sm:p-3 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
            />
          </div>
          <div>
            <label class="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">CVV</label>
            <input
              v-model="cardDetails.cvv"
              type="text"
              placeholder="123"
              maxlength="3"
              class="w-full border dark:border-gray-600 p-2 sm:p-3 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Payment Form -->
    <div v-if="paymentMethod === 'mobile'" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6 transition-colors">
      <h3 class="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-4">Mobile Payment Details</h3>
      
      <div class="space-y-3 sm:space-y-4">
        <div>
          <label class="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Mobile Provider</label>
          <select v-model="mobileDetails.provider" class="w-full border dark:border-gray-600 p-2 sm:p-3 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
            <option value="">Select Provider</option>
            <option value="dialog">Dialog</option>
            <option value="mobitel">Mobitel</option>
            <option value="hutch">Hutch</option>
          </select>
        </div>
        <div>
          <label class="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Mobile Number</label>
          <input
            v-model="mobileDetails.number"
            type="tel"
            placeholder="07XXXXXXXX"
            class="w-full border dark:border-gray-600 p-2 sm:p-3 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
          />
        </div>
      </div>
    </div>

    <!-- Bank Transfer Info -->
    <div v-if="paymentMethod === 'bank'" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6 transition-colors">
      <h3 class="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-4">Bank Transfer Instructions</h3>
      
      <div class="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-lg text-xs sm:text-sm text-gray-700 dark:text-gray-300">
        <p class="mb-2">Please transfer the amount to:</p>
        <p class="font-mono"><strong>Bank:</strong> Commercial Bank</p>
        <p class="font-mono"><strong>Account:</strong> 1234567890</p>
        <p class="font-mono"><strong>Name:</strong> Bus Booking (Pvt) Ltd</p>
        <p class="font-mono"><strong>Branch:</strong> Colombo</p>
        <p class="mt-3 text-orange-600 dark:text-orange-400">
          ⚠️ After transfer, send the receipt to payment@busbooking.lk with booking reference.
        </p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <button
        @click="router.back()"
        class="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base"
      >
        ← Back
      </button>
      <button
        @click="processPayment"
        :disabled="!paymentMethod || processing"
        class="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base"
      >
        <span v-if="processing">Processing...</span>
        <span v-else>Pay Rs {{ bookingData.totalAmount || 0 }}</span>
      </button>
    </div>

    <!-- Security Info -->
    <div class="mt-4 sm:mt-6 text-center">
      <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        🔒 Your payment is secure and encrypted
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { db } from "../firebase/db";
import { auth } from "../firebase/index";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  getDoc
} from "firebase/firestore";
import { useHead } from "@vueuse/head";
import { sendBookingConfirmation } from "../services/emailService";

useHead({
  title: "Payment | Bus Booking App",
  meta: [
    {
      name: "description",
      content: "Complete your bus ticket payment securely."
    }
  ]
});

const router = useRouter();
const route = useRoute();

const paymentMethod = ref("");
const processing = ref(false);

const bookingData = ref({
  busRoute: "",
  busNo: "",
  date: "",
  time: "",
  seats: [],
  totalAmount: 0,
  busId: ""
});

const cardDetails = ref({
  number: "",
  name: "",
  expiry: "",
  cvv: ""
});

const mobileDetails = ref({
  provider: "",
  number: ""
});

// 🔥 STORE REAL USER NAME HERE
const userName = ref("Guest User");

onMounted(async () => {
  const data =
    route.params.bookingData ||
    JSON.parse(sessionStorage.getItem("pendingBooking") || "{}");

  if (!data || !data.totalAmount || !data.busRoute) {
    alert("No booking data found or incomplete booking information");
    router.push("/search");
    return;
  }

  bookingData.value = data;

  // ✅ FETCH USER NAME FROM FIRESTORE
  if (auth.currentUser) {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      userName.value = userSnap.data().name;
    }
  }

  console.log("Loaded booking data:", bookingData.value);
  console.log("Logged user name:", userName.value);
});

const processPayment = async () => {
  if (!auth.currentUser) {
    alert("Please login to complete payment");
    router.push("/login");
    return;
  }

  if (!bookingData.value.busRoute || !bookingData.value.busId || !bookingData.value.date) {
    alert("Missing required booking information. Please restart the booking process.");
    router.push("/search");
    return;
  }

  if (paymentMethod.value === "card") {
    if (!cardDetails.value.number || !cardDetails.value.name || !cardDetails.value.expiry || !cardDetails.value.cvv) {
      alert("Please fill all card details");
      return;
    }
  } else if (paymentMethod.value === "mobile") {
    if (!mobileDetails.value.provider || !mobileDetails.value.number) {
      alert("Please fill all mobile payment details");
      return;
    }
  }

  processing.value = true;

  try {
    await new Promise(resolve => setTimeout(resolve, 2000));

    // ✅ USE FIRESTORE NAME (NOT displayName)
    const bookingDoc = {
      userId: auth.currentUser.uid,
      name: userName.value,
      email: auth.currentUser.email || "",
      busId: bookingData.value.busId,
      seats: bookingData.value.seats || [],
      totalAmount: Number(bookingData.value.totalAmount) || 0,
      busRoute: bookingData.value.busRoute,
      busNo: bookingData.value.busNo || "",
      date: bookingData.value.date,
      travelDate: bookingData.value.date,
      time: bookingData.value.time || "",
      paymentMethod: paymentMethod.value,
      status: paymentMethod.value === "bank" ? "PENDING" : "CONFIRMED",
      bookingDate: Timestamp.now(),
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, "bookings"), bookingDoc);

    sessionStorage.removeItem("pendingBooking");

    // ✅ EMAIL WITH CORRECT NAME
    await sendBookingConfirmation({
      bookingId: docRef.id,
      name: userName.value,
      email: auth.currentUser.email,
      busRoute: bookingData.value.busRoute,
      busNo: bookingData.value.busNo,
      date: bookingData.value.date,
      time: bookingData.value.time,
      seats: bookingData.value.seats,
      totalAmount: bookingData.value.totalAmount,
      status: bookingDoc.status
    });

    alert(`✅ Payment ${paymentMethod.value === 'bank' ? 'initiated' : 'successful'}! Booking confirmed. ${auth.currentUser.email ? 'A confirmation email has been sent.' : ''}`);
    router.push("/history");

  } catch (error) {
    console.error("Payment error:", error);
    alert("Payment failed: " + (error.message || "Unknown error"));
  } finally {
    processing.value = false;
  }
};
</script>