<template>
  <div class="max-w-md mx-auto mt-6 sm:mt-10 p-4">
    <!-- Loading state -->
    <div v-if="loading" class="text-center text-gray-500 dark:text-gray-400 transition-colors">
      Loading seat selection...
    </div>

    <!-- Main content -->
    <div v-else-if="bus">
      <!-- Header -->
      <div class="text-center mb-4 sm:mb-6" data-aos="fade-down">
        <h1 class="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors">{{ busRoute }}</h1>
        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors">{{ travelDate }}</p>
        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-colors">Departure: {{ bus.time }}</p>
      </div>

      <!-- Bus Layout -->
      <div class="bg-gray-100 dark:bg-gray-700 rounded-3xl p-4 sm:p-6 shadow-lg relative transition-colors" data-aos="zoom-in">

        <!-- Driver -->
        <div class="flex justify-end mb-4 sm:mb-6">
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 dark:bg-gray-900 rounded-lg flex items-center justify-center transition-colors">
              <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
              </svg>
            </div>
            <span class="text-xs font-semibold mt-1 text-gray-700 dark:text-gray-300 transition-colors">Driver</span>
          </div>
        </div>

        <!-- Seats grid -->
        <div class="space-y-2 sm:space-y-3">
          <div
            v-for="(row, rowIndex) in seatRows"
            :key="rowIndex"
            class="flex justify-between items-center"
          >
            <!-- Left seats -->
            <div class="flex gap-1 sm:gap-2">
              <button
                v-for="seat in row.left"
                :key="seat"
                :disabled="bookedSeats.includes(seat)"
                :class="seatClass(seat)"
                @click="toggleSeat(seat)"
              >
                <div class="flex flex-col items-center justify-center h-full">
                  <svg class="w-5 h-5 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 9h16v10c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V9z"/>
                    <path d="M4 9V7c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2"/>
                    <rect x="3" y="17" width="2" height="4" rx="1"/>
                    <rect x="19" y="17" width="2" height="4" rx="1"/>
                  </svg>
                  <span class="text-[8px] sm:text-[10px] font-bold">{{ seat }}</span>
                </div>
              </button>
            </div>

            <!-- Aisle -->
            <div class="w-4 sm:w-8"></div>

            <!-- Right seats -->
            <div class="flex gap-1 sm:gap-2">
              <button
                v-for="seat in row.right"
                :key="seat"
                :disabled="bookedSeats.includes(seat)"
                :class="seatClass(seat)"
                @click="toggleSeat(seat)"
              >
                <div class="flex flex-col items-center justify-center h-full">
                  <svg class="w-5 h-5 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 9h16v10c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V9z"/>
                    <path d="M4 9V7c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2"/>
                    <rect x="3" y="17" width="2" height="4" rx="1"/>
                    <rect x="19" y="17" width="2" height="4" rx="1"/>
                  </svg>
                  <span class="text-[8px] sm:text-[10px] font-bold">{{ seat }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Back row (5 seats) -->
        <div class="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t-2 border-dashed border-gray-300 dark:border-gray-500 transition-colors">
          <div class="flex justify-center gap-1 sm:gap-2">
            <button
              v-for="seat in backRow"
              :key="seat"
              :disabled="bookedSeats.includes(seat)"
              :class="seatClass(seat)"
              @click="toggleSeat(seat)"
            >
              <div class="flex flex-col items-center justify-center h-full">
                <svg class="w-5 h-5 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 9h16v10c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V9z"/>
                  <path d="M4 9V7c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2"/>
                  <rect x="3" y="17" width="2" height="4" rx="1"/>
                  <rect x="19" y="17" width="2" height="4" rx="1"/>
                </svg>
                <span class="text-[8px] sm:text-[10px] font-bold">{{ seat }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex justify-around mt-4 sm:mt-6 text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 transition-colors">
        <div class="flex items-center gap-1">
          <div class="w-6 h-6 sm:w-8 sm:h-8 bg-red-500 dark:bg-red-600 rounded flex items-center justify-center transition-colors">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 9h16v10c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V9z"/>
              <path d="M4 9V7c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2"/>
              <rect x="3" y="17" width="2" height="4" rx="1"/>
              <rect x="19" y="17" width="2" height="4" rx="1"/>
            </svg>
          </div>
          <span>Booked</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-6 h-6 sm:w-8 sm:h-8 bg-white dark:bg-gray-600 border-2 border-gray-400 dark:border-gray-500 rounded flex items-center justify-center transition-colors">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 9h16v10c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V9z"/>
              <path d="M4 9V7c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2"/>
              <rect x="3" y="17" width="2" height="4" rx="1"/>
              <rect x="19" y="17" width="2" height="4" rx="1"/>
            </svg>
          </div>
          <span>Available</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 dark:bg-green-600 rounded flex items-center justify-center transition-colors">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 9h16v10c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V9z"/>
              <path d="M4 9V7c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2"/>
              <rect x="3" y="17" width="2" height="4" rx="1"/>
              <rect x="19" y="17" width="2" height="4" rx="1"/>
            </svg>
          </div>
          <span>Selected</span>
        </div>
      </div>

      <!-- Booking summary -->
      <div class="mt-4 sm:mt-6 bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow transition-colors" data-aos="fade-up">

        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors">
          Selected Seats: 
          <span class="font-bold text-blue-600 dark:text-blue-400 transition-colors">
            {{ selectedSeats.length > 0 ? selectedSeats.sort((a, b) => a - b).join(', ') : 'None' }}
          </span>
        </p>
        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 transition-colors">
          Total Amount: 
          <span class="font-bold text-blue-600 dark:text-blue-400 transition-colors">Rs {{ calculateTotal }}</span>
        </p>
        <button
          class="bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-800 text-white w-full py-2 sm:py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base"
          :disabled="selectedSeats.length === 0"
          @click="proceedToPayment"
        >
          Proceed to Payment →
        </button>
      </div>
    </div>

    <!-- Error state -->
    <div v-else class="text-center text-red-500 dark:text-red-400 transition-colors">
      Bus not found. <router-link to="/" class="text-blue-500 dark:text-blue-400 underline">Go back</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { db } from "../firebase/db";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useHead } from "@vueuse/head";


useHead({
  title: "Select Seats | Bus Booking App",
  meta: [
    {
      name: "description",
      content: "Select your seats and complete your bus booking."
    }
  ]
});

const route = useRoute();
const router = useRouter();
const busId = route.query.busId;
const travelDate = route.query.date;

const user = ref(null);
const bus = ref(null);
const loading = ref(true);
const bookedSeats = ref([]);
const selectedSeats = ref([]);
const seatRows = ref([]);
const backRow = ref([]);

// Computed property for the bus route
const busRoute = computed(() => {
  if (!bus.value) return "";
  // Create route from 'from' and 'to' fields, or use 'route' field if it exists
  return bus.value.route || `${bus.value.from} → ${bus.value.to}`;
});

onAuthStateChanged(auth, (u) => {
  if (!u) {
    alert("Please login to book seats");
    router.push("/login");
  } else {
    user.value = u;
  }
});

const calculateTotal = computed(() => {
  const price = Number(bus.value?.price) || 0;
  return price * selectedSeats.value.length;
});

const loadBookedSeats = async () => {
  if (!travelDate || !busId) return;

  const q = query(
    collection(db, "bookings"),
    where("busId", "==", busId),
    where("date", "==", travelDate)
  );

  const snapshot = await getDocs(q);
  bookedSeats.value = snapshot.docs.flatMap(doc => doc.data().seats);
};

onMounted(async () => {
  if (!busId || !travelDate) {
    alert("Missing booking information");
    router.push("/search");
    return;
  }

  const busDoc = await getDoc(doc(db, "buses", busId));
  if (!busDoc.exists()) {
    router.push("/");
    return;
  }

  bus.value = { id: busDoc.id, ...busDoc.data() };

  await loadBookedSeats();

  const rows = [];
  for (let i = 1; i <= 35; i += 4) {
    rows.push({ left: [i, i+1], right: [i+2, i+3] });
  }
  seatRows.value = rows;
  backRow.value = [37, 38, 39, 40, 41, 42];

  loading.value = false;
});

const toggleSeat = (seat) => {
  if (selectedSeats.value.includes(seat)) {
    selectedSeats.value = selectedSeats.value.filter(s => s !== seat);
  } else {
    selectedSeats.value.push(seat);
  }
};

const proceedToPayment = () => {
  if (!bus.value || selectedSeats.value.length === 0 || !user.value) {
    alert("Please select seats");
    return;
  }

  // Create the route string properly
  const route = bus.value.route || `${bus.value.from} → ${bus.value.to}`;

  const bookingData = {
    busId,
    seats: selectedSeats.value,
    totalAmount: calculateTotal.value,
    busRoute: route, // Now properly constructed
    busNo: bus.value.busNo,
    date: travelDate,
    time: bus.value.time,
  };

  // Store booking data in sessionStorage
  sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));

  // Navigate to payment page
  router.push("/payment");
};

const seatClass = (seat) => {
  const baseClass = "w-11 h-12 sm:w-14 sm:h-16 rounded-lg rounded-t-2xl flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md";
  
  if (bookedSeats.value.includes(seat)) {
    return `${baseClass} bg-red-500 dark:bg-red-600 text-white cursor-not-allowed opacity-70`;
  }
  
  if (selectedSeats.value.includes(seat)) {
    return `${baseClass} bg-green-500 dark:bg-green-600 text-white cursor-pointer shadow-lg scale-105 ring-2 ring-green-300`;
  }
  
  return `${baseClass} bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 border-2 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-600 dark:hover:to-blue-700 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer hover:scale-105`;
};
</script>