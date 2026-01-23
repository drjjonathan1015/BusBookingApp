<template>
  <div class="max-w-4xl mx-auto mt-10 px-4">
    <h1 class="text-3xl font-bold text-center mb-8 text-blue-600">🚌 Available Buses</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center text-gray-500 py-10">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4">Loading buses...</p>
    </div>

    <!-- No Results -->
    <div v-else-if="buses.length === 0" class="text-center py-10">
      <div class="text-gray-400 text-6xl mb-4">🚌</div>
      <p class="text-gray-600 text-lg mb-2">No buses available for selected date/route.</p>
      <p class="text-gray-500 mb-6">Try searching for a different date or route.</p>
      <router-link 
        to="/search" 
        class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
      >
        🔍 Search Again
      </router-link>
    </div>

    <!-- Bus List -->
    <div v-else class="space-y-4">
      <div
        v-for="bus in buses"
        :key="bus.id"
        class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
      >
        <div class="flex justify-between items-center flex-wrap gap-4">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-blue-600 mb-2">{{ bus.from }} → {{ bus.to }}</h3>
            <div class="space-y-1 text-gray-700">
              <p>🚌 <strong>Bus No:</strong> {{ bus.busNo }}</p>
              <p>📅 <strong>Date:</strong> {{ formatDate(bus.date) }}</p>
              <p>🕐 <strong>Time:</strong> {{ bus.time }}</p>
              <p>
                💺 <strong>Seats Available:</strong> 
                <span :class="bus.seatsAvailable < 10 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'">
                  {{ bus.seatsAvailable }}/{{ bus.totalSeats }}
                </span>
              </p>
            </div>
          </div>

          <div class="text-right">
            <p class="text-3xl font-bold text-green-600 mb-4">Rs {{ bus.price }}</p>
            <button
              @click="bookBus(bus)"
              :disabled="bus.seatsAvailable === 0"
              :class="bus.seatsAvailable === 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-700'"
              class="text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              {{ bus.seatsAvailable === 0 ? "Fully Booked" : "Book Now" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/db";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const buses = ref([]);
const loading = ref(true);

const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  if (timestamp.toDate) return timestamp.toDate().toLocaleDateString();
  return new Date(timestamp).toLocaleDateString();
};

onMounted(async () => {
  try {
    const snapshot = await getDocs(collection(db, "buses"));
    const dateQuery = route.query.date;
    const routeQuery = route.query.route;

    console.log("Date Query:", dateQuery);
    console.log("Route Query:", routeQuery);
    console.log("Total buses in DB:", snapshot.docs.length);

    buses.value = snapshot.docs
      .map(doc => ({ 
        id: doc.id, 
        ...doc.data(), 
        seatsAvailable: doc.data().seatsAvailable ?? doc.data().totalSeats ?? 40 
      }))
      .filter(bus => {
        const busDate = bus.date?.toDate ? bus.date.toDate() : new Date(bus.date);
        const selectedDate = new Date(dateQuery);
        const busRoute = `${bus.from} → ${bus.to}`;
        
        const dateMatch = busDate.toDateString() === selectedDate.toDateString();
        const routeMatch = busRoute === routeQuery;
        
        console.log("Bus:", bus.busNo, "Date Match:", dateMatch, "Route Match:", routeMatch);
        
        return dateMatch && routeMatch;
      });

    console.log("Filtered buses:", buses.value.length);
  } catch (error) {
    console.error("Error loading buses:", error);
    alert("Error loading buses. Check console for details.");
  } finally {
    loading.value = false;
  }
});

const bookBus = (bus) => {
  router.push({ name: "SeatSelection", query: { busId: bus.id } });
};
</script>