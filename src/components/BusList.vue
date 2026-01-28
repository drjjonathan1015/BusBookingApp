<template>
  <div class="max-w-4xl mx-auto mt-6 sm:mt-10 px-4">
    <h1
      class="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-blue-600 dark:text-blue-400 transition-colors"
      data-aos="fade-down"
    >
      <lottie-bus-available/> Available Buses
    </h1>

    <!-- Search Info -->
    <div class="bg-blue-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 transition-colors text-sm sm:text-base">
      <div class="flex flex-wrap gap-2 sm:gap-4 justify-center text-gray-700 dark:text-gray-200">
        <span><strong>From:</strong> {{ fromQuery }}</span>
        <span><strong>To:</strong> {{ toQuery }}</span>
        <span><strong>Date:</strong> {{ formatDate(dateQuery) }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center text-gray-500 dark:text-gray-400 py-10 transition-colors">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      <p class="mt-4 text-sm sm:text-base">Loading buses...</p>
    </div>

    <!-- No Results -->
    <div v-else-if="buses.length === 0" class="text-center py-10">
      <div class="text-gray-400 text-5xl sm:text-6xl mb-4"> <lottie-broken-bus/> </div>
      <p class="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-2 transition-colors">No buses available for this route.</p>
      <p class="text-gray-500 dark:text-gray-400 mb-6 text-sm sm:text-base transition-colors">Try searching for a different route or date.</p>
      <router-link 
        to="/search" 
        class="inline-block bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base"
      >
        🔍 Search Again
      </router-link>
    </div>

    <!-- Bus List -->
    <div v-else class="space-y-4">
      <div
        v-for="(bus, index) in buses"
        :key="bus.id"
        data-aos="fade-up"
        :data-aos-delay="index * 120"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-xl transition transform hover:-translate-y-1">

        <div class="flex justify-between items-start flex-wrap gap-4">
          <div class="flex-1">
            <h3 class="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 mb-2 transition-colors">{{ bus.from }} → {{ bus.to }}</h3>
            <div class="space-y-1 text-gray-700 dark:text-gray-300 transition-colors text-sm sm:text-base">
              <p>🚌 <strong>Bus No:</strong> {{ bus.busNo }}</p>
              <p>🕐 <strong>Time:</strong> {{ bus.time }}</p>
              <p>📅 <strong>Service:</strong> <span class="text-green-600 dark:text-green-400 font-semibold transition-colors">Daily Service</span></p>
              <p>💺 <strong>Total Seats:</strong> {{ bus.totalSeats }}</p>
              
              <!-- Available Seats Display -->
              <div class="mt-2 flex items-center gap-2">
                <span class="font-semibold">Available:</span>
                <span 
                  :class="getAvailabilityClass(bus.availableSeats, bus.totalSeats)"
                  class="px-3 py-1 rounded-full font-bold text-sm"
                >
                  {{ bus.availableSeats }} / {{ bus.totalSeats }} seats
                </span>
              </div>
              
              <!-- Availability Bar -->
              <div class="mt-2">
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    :style="{ width: getAvailabilityPercentage(bus.availableSeats, bus.totalSeats) + '%' }"
                    :class="getAvailabilityBarClass(bus.availableSeats, bus.totalSeats)"
                    class="h-2 rounded-full transition-all duration-300"
                  ></div>
                </div>
              </div>
              
              <!-- Status Messages -->
              <p v-if="bus.availableSeats === 0" class="text-red-600 dark:text-red-400 font-semibold text-sm mt-1">
                ❌ Fully Booked
              </p>
              <p v-else-if="bus.availableSeats <= 5" class="text-orange-600 dark:text-orange-400 font-semibold text-sm mt-1">
                🔥 Only {{ bus.availableSeats }} seats left - Book now!
              </p>
              <p v-else-if="bus.availableSeats <= 10" class="text-yellow-600 dark:text-yellow-400 font-semibold text-sm mt-1">
                ⚡ Filling fast - {{ bus.availableSeats }} seats available
              </p>
            </div>
          </div>

          <div class="text-right">
            <p class="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-2 transition-colors">Rs {{ bus.price }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">per seat</p>
            
            <button
              @click="bookBus(bus)"
              :disabled="bus.availableSeats === 0"
              :class="bus.availableSeats === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 hover:scale-105 active:scale-95'"
              class="text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition transform text-sm sm:text-base w-full sm:w-auto"
            >
              {{ bus.availableSeats === 0 ? 'Sold Out' : 'Book Now' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/db";
import { useRoute, useRouter } from "vue-router";
import { useHead } from "@vueuse/head";
import LottieSearch from "./LottieSearch.vue";
import LottieBusAvailable from "./LottieBusAvailable.vue";
import LottieBrokenBus from "./LottieBrokenBus.vue";

useHead({
  title: "Available Buses | Bus Booking App",
  meta: [
    {
      name: "description",
      content: "View and book available buses for your selected route."
    }
  ]
});

const router = useRouter();
const route = useRoute();

const buses = ref([]);
const loading = ref(true);

const fromQuery = route.query.from;
const toQuery = route.query.to;
const dateQuery = route.query.date;

/**
 * Calculate available seats for a bus on the selected date
 */
const calculateAvailableSeats = async (busId, totalSeats) => {
  try {
    // Query bookings for this bus on the selected date
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("busId", "==", busId),
      where("travelDate", "==", dateQuery)
    );
    
    const bookingsSnapshot = await getDocs(bookingsQuery);
    
    // Get all booked seats
    const bookedSeats = [];
    bookingsSnapshot.docs.forEach(doc => {
      const booking = doc.data();
      if (booking.status !== 'CANCELLED' && Array.isArray(booking.seats)) {
        bookedSeats.push(...booking.seats);
      }
    });
    
    // Calculate available seats
    const bookedCount = bookedSeats.length;
    const available = totalSeats - bookedCount;
    
    return Math.max(0, available); // Ensure it's not negative
  } catch (error) {
    console.error("Error calculating available seats:", error);
    return totalSeats; // Return total seats if error
  }
};

onMounted(async () => {
  try {
    console.log("Loading buses for:", { from: fromQuery, to: toQuery, date: dateQuery });
    
    const snapshot = await getDocs(collection(db, "buses"));
    console.log("Total buses in database:", snapshot.docs.length);

    const allBuses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Filter by FROM and TO cities only
    let filteredBuses = allBuses.filter(bus => {
      const fromMatch = bus.from === fromQuery;
      const toMatch = bus.to === toQuery;
      const isActive = bus.active !== false;

      return fromMatch && toMatch && isActive;
    });

    console.log("Filtered buses count:", filteredBuses.length);

    // Calculate available seats for each bus
    const busesWithAvailability = await Promise.all(
      filteredBuses.map(async (bus) => {
        const availableSeats = await calculateAvailableSeats(bus.id, bus.totalSeats);
        return {
          ...bus,
          availableSeats
        };
      })
    );

    // Sort by available seats (most available first), then by time
    buses.value = busesWithAvailability.sort((a, b) => {
      if (b.availableSeats !== a.availableSeats) {
        return b.availableSeats - a.availableSeats;
      }
      return (a.time || "").localeCompare(b.time || "");
    });

  } catch (err) {
    console.error("Error loading buses:", err);
    alert("Error loading buses");
  } finally {
    loading.value = false;
  }
});

const bookBus = (bus) => {
  if (bus.availableSeats === 0) {
    alert("This bus is fully booked. Please select another bus or date.");
    return;
  }
  
  // Pass the date along with busId to seat selection
  router.push({ 
    name: "SeatSelection", 
    query: { 
      busId: bus.id,
      date: dateQuery 
    } 
  });
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { 
    weekday: 'short',
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const getAvailabilityPercentage = (available, total) => {
  if (!total) return 0;
  return (available / total) * 100;
};

const getAvailabilityClass = (available, total) => {
  const percentage = (available / total) * 100;
  
  if (percentage === 0) {
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  } else if (percentage <= 20) {
    return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
  } else if (percentage <= 50) {
    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  } else {
    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  }
};

const getAvailabilityBarClass = (available, total) => {
  const percentage = (available / total) * 100;
  
  if (percentage === 0) {
    return 'bg-red-500 dark:bg-red-600';
  } else if (percentage <= 20) {
    return 'bg-orange-500 dark:bg-orange-600';
  } else if (percentage <= 50) {
    return 'bg-yellow-500 dark:bg-yellow-600';
  } else {
    return 'bg-green-500 dark:bg-green-600';
  }
};
</script>