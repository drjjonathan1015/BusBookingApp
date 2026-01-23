<template>
  <div class="max-w-md mx-auto mt-10 p-4">
    <!-- Loading state -->
    <div v-if="loading" class="text-center text-gray-500">
      Loading seat selection...
    </div>

    <!-- Main content -->
    <div v-else-if="bus">
      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-blue-600">{{ bus.route }}</h1>
        <p class="text-sm text-gray-600 mt-1">{{ formatDate(bus.date) }}</p>
        <p class="text-sm text-gray-600">{{ bus.time }}</p>
      </div>

      <!-- Bus Layout -->
      <div class="bg-gray-100 rounded-3xl p-6 shadow-lg relative">
        <!-- Driver -->
        <div class="flex justify-end mb-6">
          <div class="flex flex-col items-center">
            <div class="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
              </svg>
            </div>
            <span class="text-xs font-semibold mt-1 text-gray-700">Driver</span>
          </div>
        </div>

        <!-- Seats grid -->
        <div class="space-y-3">
          <div
            v-for="(row, rowIndex) in seatRows"
            :key="rowIndex"
            class="flex justify-between items-center"
          >
            <!-- Left seats -->
            <div class="flex gap-2">
              <button
                v-for="seat in row.left"
                :key="seat"
                :disabled="bookedSeats.includes(seat)"
                :class="seatClass(seat)"
                @click="toggleSeat(seat)"
              >
                <div class="flex flex-col items-center justify-center h-full">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="16" rx="3" ry="3"/>
                  </svg>
                  <span class="text-[10px] font-bold mt-0.5">{{ seat }}</span>
                </div>
              </button>
            </div>

            <!-- Aisle -->
            <div class="w-8"></div>

            <!-- Right seats -->
            <div class="flex gap-2">
              <button
                v-for="seat in row.right"
                :key="seat"
                :disabled="bookedSeats.includes(seat)"
                :class="seatClass(seat)"
                @click="toggleSeat(seat)"
              >
                <div class="flex flex-col items-center justify-center h-full">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="16" rx="3" ry="3"/>
                  </svg>
                  <span class="text-[10px] font-bold mt-0.5">{{ seat }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Back row (5 seats) -->
        <div class="mt-3 pt-3 border-t-2 border-dashed border-gray-300">
          <div class="flex justify-center gap-2">
            <button
              v-for="seat in backRow"
              :key="seat"
              :disabled="bookedSeats.includes(seat)"
              :class="seatClass(seat)"
              @click="toggleSeat(seat)"
            >
              <div class="flex flex-col items-center justify-center h-full">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="4" width="20" height="16" rx="3" ry="3"/>
                </svg>
                <span class="text-[10px] font-bold mt-0.5">{{ seat }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex justify-around mt-6 text-xs text-gray-700">
        <div class="flex items-center gap-1">
          <div class="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="4" width="20" height="16" rx="3" ry="3"/>
            </svg>
          </div>
          <span>Booked</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-8 h-8 bg-white border-2 border-gray-400 rounded flex items-center justify-center">
            <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="4" width="20" height="16" rx="3" ry="3"/>
            </svg>
          </div>
          <span>Available</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="4" width="20" height="16" rx="3" ry="3"/>
            </svg>
          </div>
          <span>Selected</span>
        </div>
      </div>

      <!-- Booking summary -->
      <div class="mt-6 bg-white rounded-lg p-4 shadow">
        <p class="text-sm text-gray-600 mb-2">
          Selected Seats: 
          <span class="font-bold text-blue-600">
            {{ selectedSeats.length > 0 ? selectedSeats.sort((a, b) => a - b).join(', ') : 'None' }}
          </span>
        </p>
        <p class="text-sm text-gray-600 mb-4">
          Total Amount: 
          <span class="font-bold text-blue-600">Rs {{ calculateTotal }}</span>
        </p>
        <button
          class="bg-pink-600 hover:bg-pink-700 text-white w-full py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
          :disabled="selectedSeats.length === 0"
          @click="confirmBooking"
        >
          Confirm Booking
        </button>
      </div>
    </div>

    <!-- Error state -->
    <div v-else class="text-center text-red-500">
      Bus not found. <router-link to="/" class="text-blue-500 underline">Go back</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { db } from "../firebase/db";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, addDoc, updateDoc } from "firebase/firestore";

const route = useRoute();
const router = useRouter();
const busId = route.query.busId;

const user = ref(null);

onAuthStateChanged(auth, (u) => {
  if (!u) {
    alert("Please login to book seats");
    router.push("/login");
  } else {
    user.value = u;
  }
});

const bus = ref(null);
const loading = ref(true);
const bookedSeats = ref([]);
const selectedSeats = ref([]);
const seatRows = ref([]);
const backRow = ref([]);

const calculateTotal = computed(() => {
  const price = Number(bus.value?.price) || 0;
  return price * selectedSeats.value.length;
});

const formatDate = (timestamp) => {
  if (!timestamp?.toDate) return timestamp;
  return timestamp.toDate().toLocaleDateString(undefined, { 
    weekday: "short", 
    year: "numeric", 
    month: "short", 
    day: "numeric" 
  });
};

onMounted(async () => {
  if (!busId) return router.push("/");

  const busDoc = await getDoc(doc(db, "buses", busId));
  if (!busDoc.exists()) return router.push("/");

  bus.value = { id: busDoc.id, ...busDoc.data() };

  const bookingsSnap = await getDocs(collection(db, "bookings"));
  bookedSeats.value = bookingsSnap.docs
    .filter(b => b.data().busId === busId)
    .flatMap(b => b.data().seats);

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

const confirmBooking = async () => {
  if (!bus.value || selectedSeats.value.length === 0 || !user.value) return;

  const totalAmount = calculateTotal.value;

  await addDoc(collection(db, "bookings"), {
    userId: user.value.uid,
    name: user.value.displayName || "",
    email: user.value.email,
    busId,
    seats: selectedSeats.value,
    totalAmount,
    busRoute: bus.value.route,
    busNo: bus.value.busNo,
    date: bus.value.date,
    time: bus.value.time,
    status: "CONFIRMED",
    timestamp: new Date()
  });

  const busRef = doc(db, "buses", busId);
  await updateDoc(busRef, { seatsAvailable: bus.value.seatsAvailable - selectedSeats.value.length });

  alert(`Booking successful! ${selectedSeats.value.length} seat(s) booked. Total: Rs ${totalAmount}`);
  router.push("/history");
};

const seatClass = (seat) => {
  const baseClass = "w-12 h-12 rounded-lg flex items-center justify-center transition-all";
  if (bookedSeats.value.includes(seat)) return `${baseClass} bg-red-500 text-white cursor-not-allowed opacity-60`;
  if (selectedSeats.value.includes(seat)) return `${baseClass} bg-green-500 text-white cursor-pointer shadow-lg scale-105`;
  return `${baseClass} bg-white border-2 border-gray-400 text-gray-700 hover:bg-blue-100 hover:border-blue-400 cursor-pointer`;
};
</script>