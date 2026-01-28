<template>
  <div class="max-w-4xl mx-auto mt-6 sm:mt-10 px-4 pb-8">
    <h2 class="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 dark:text-white transition-colors">
      🎫 My Bookings
    </h2>

    <div v-if="loading" class="text-center py-10">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-300">Loading bookings...</p>
    </div>

    <div v-else-if="bookings.length === 0" class="text-center py-10">
      <div class="text-gray-400 text-6xl mb-4">🎫</div>
      <p class="text-gray-600 dark:text-gray-300 text-lg mb-4 transition-colors">No bookings found.</p>
      <router-link 
        to="/search" 
        class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
      >
        🔍 Book a Bus
      </router-link>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="booking in bookings"
        :key="booking.id"
        class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 sm:p-6 transition-colors hover:shadow-xl"
      >
        <!-- Booking Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div>
            <h3 class="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">{{ booking.busRoute }}</h3>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Bus No: {{ booking.busNo }}</p>
          </div>
          <span 
            :class="getStatusClass(booking.status)"
            class="px-3 py-1 rounded-full font-semibold text-xs sm:text-sm whitespace-nowrap"
          >
            {{ booking.status }}
          </span>
        </div>

        <!-- Booking Details -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base mb-4">
          <div class="space-y-2">
            <p class="text-gray-700 dark:text-gray-300">
              <span class="font-semibold">📅 Date:</span> {{ formatDate(booking) }}
            </p>
            <p class="text-gray-700 dark:text-gray-300">
              <span class="font-semibold">⏰ Time:</span> {{ booking.time }}
            </p>
          </div>
          <div class="space-y-2">
            <p class="text-gray-700 dark:text-gray-300">
              <span class="font-semibold">💺 Seats:</span> {{ booking.seats.join(", ") }}
            </p>
            <p class="text-gray-700 dark:text-gray-300">
              <span class="font-semibold">💰 Total:</span> Rs {{ booking.totalAmount }}
            </p>
          </div>
        </div>

        <!-- Payment Method -->
        <div v-if="booking.paymentMethod" class="mb-4">
          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            💳 Payment: {{ formatPaymentMethod(booking.paymentMethod) }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            @click="viewDetails(booking)"
            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition text-sm sm:text-base"
          >
            👁️ View Details
          </button>
          
          <button
            v-if="canCancel(booking)"
            @click="cancelBooking(booking)"
            class="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition text-sm sm:text-base"
          >
            ❌ Cancel Booking
          </button>

          <button
            @click="downloadTicket(booking)"
            :disabled="downloadingTicket"
            class="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold transition text-sm sm:text-base"
          >
            {{ downloadingTicket ? '⏳ Generating...' : '📄 Download Ticket' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="selectedBooking" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="selectedBooking = null">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full" @click.stop>
        <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">🎫 Booking Details</h3>
        
        <div class="space-y-3 text-sm">
          <div class="border-b dark:border-gray-700 pb-3">
            <p class="text-gray-500 dark:text-gray-400 text-xs">Booking ID</p>
            <p class="font-mono text-gray-800 dark:text-white">{{ selectedBooking.id }}</p>
          </div>
          
          <div>
            <p class="text-gray-500 dark:text-gray-400 text-xs">Route</p>
            <p class="font-semibold text-gray-800 dark:text-white">{{ selectedBooking.busRoute }}</p>
          </div>
          
          <div>
            <p class="text-gray-500 dark:text-gray-400 text-xs">Bus Number</p>
            <p class="text-gray-800 dark:text-white">{{ selectedBooking.busNo }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <div>
              <p class="text-gray-500 dark:text-gray-400 text-xs">Date</p>
              <p class="text-gray-800 dark:text-white">{{ formatDate(selectedBooking) }}</p>
            </div>
            <div>
              <p class="text-gray-500 dark:text-gray-400 text-xs">Time</p>
              <p class="text-gray-800 dark:text-white">{{ selectedBooking.time }}</p>
            </div>
          </div>
          
          <div>
            <p class="text-gray-500 dark:text-gray-400 text-xs">Seat Numbers</p>
            <p class="text-gray-800 dark:text-white font-semibold">{{ selectedBooking.seats.join(', ') }}</p>
          </div>
          
          <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
            <p class="text-gray-500 dark:text-gray-400 text-xs">Total Amount</p>
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">Rs {{ selectedBooking.totalAmount }}</p>
          </div>
        </div>

        <button
          @click="selectedBooking = null"
          class="w-full mt-6 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../firebase/index";
import { db } from "../firebase/db";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useHead } from "@vueuse/head";
import ticketGenerator from '../services/ticketGenerator';

useHead({
  title: "My Bookings | Bus Booking App",
  meta: [
    {
      name: "description",
      content: "View and manage your bus bookings."
    }
  ]
});

const router = useRouter();
const bookings = ref([]);
const loading = ref(true);
const selectedBooking = ref(null);
const downloadingTicket = ref(false);

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("Please login to view bookings");
      router.push("/login");
      return;
    }

    const q = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    bookings.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort by date (newest first) - handle both 'date' and 'travelDate' fields
    bookings.value.sort((a, b) => {
      const dateA = new Date(a.travelDate || a.date);
      const dateB = new Date(b.travelDate || b.date);
      return dateB - dateA;
    });

    loading.value = false;
  });
});

const getStatusClass = (status) => {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'PENDING':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    case 'CANCELLED':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  }
};

const formatDate = (booking) => {
  // Try travelDate first, then fall back to date
  const dateStr = booking.travelDate || booking.date;
  
  if (!dateStr) return 'Date not available';
  
  try {
    const date = new Date(dateStr);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateStr; // Return the original string if invalid
    }
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateStr; // Return original string on error
  }
};

const formatPaymentMethod = (method) => {
  const methods = {
    'card': 'Credit/Debit Card',
    'mobile': 'Mobile Payment',
    'bank': 'Bank Transfer'
  };
  return methods[method] || method;
};

const canCancel = (booking) => {
  // Can cancel if status is CONFIRMED and booking date is in the future
  if (booking.status !== 'CONFIRMED') return false;
  
  try {
    const dateStr = booking.travelDate || booking.date;
    const bookingDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return bookingDate >= today;
  } catch (error) {
    return false;
  }
};

const viewDetails = (booking) => {
  selectedBooking.value = booking;
};

const cancelBooking = async (booking) => {
  if (!confirm('Are you sure you want to cancel this booking? Refund will be processed within 5-7 business days.')) {
    return;
  }

  try {
    await updateDoc(doc(db, "bookings", booking.id), {
      status: 'CANCELLED',
      cancelledAt: new Date()
    });

    // Update local state
    const index = bookings.value.findIndex(b => b.id === booking.id);
    if (index !== -1) {
      bookings.value[index].status = 'CANCELLED';
    }

    alert('✅ Booking cancelled successfully! Refund will be processed soon.');
  } catch (error) {
    console.error('Error cancelling booking:', error);
    alert('Error cancelling booking: ' + error.message);
  }
};

const downloadTicket = async (booking) => {
  downloadingTicket.value = true;
  
  try {
    const result = await ticketGenerator.downloadTicket(booking);
    
    if (result.success) {
      alert(`✅ Ticket downloaded successfully as ${result.filename}!`);
    } else {
      alert('Error generating ticket: ' + result.error);
    }
  } catch (error) {
    console.error('Error downloading ticket:', error);
    alert('Error generating ticket: ' + error.message);
  } finally {
    downloadingTicket.value = false;
  }
};
</script>