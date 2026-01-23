<template>
  <div class="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
    <h1 class="text-3xl font-bold mb-6 text-center text-blue-600">🚌 Search Buses</h1>

    <div class="mb-4">
      <label class="block font-semibold mb-2 text-gray-700">Select Date</label>
      <input 
        type="date" 
        v-model="searchDate" 
        class="border border-gray-300 p-3 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
      />
    </div>

    <div class="mb-6">
      <label class="block font-semibold mb-2 text-gray-700">Select Route</label>
      <select 
        v-model="searchRoute" 
        class="border border-gray-300 p-3 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">-- Select Route --</option>
        <option v-for="route in routes" :key="route" :value="route">
          {{ route }}
        </option>
      </select>
    </div>

    <button
      @click="searchBuses"
      class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full font-semibold text-lg transition"
    >
      🔍 Search Buses
    </button>

    <div v-if="routes.length === 0" class="mt-4 text-center text-gray-500">
      <p>Loading available routes...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/db";
import { useRouter } from "vue-router";

const router = useRouter();
const searchDate = ref("");
const searchRoute = ref("");
const routes = ref([]);

onMounted(async () => {
  try {
    // Get unique routes from Firestore
    const snapshot = await getDocs(collection(db, "buses"));
    const routeSet = new Set();
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.from && data.to) {
        routeSet.add(`${data.from} → ${data.to}`);
      }
    });
    
    routes.value = Array.from(routeSet);
    
    if (routes.value.length === 0) {
      console.warn("No routes found in database. Please add buses first.");
    }
  } catch (error) {
    console.error("Error loading routes:", error);
    alert("Error loading routes. Please check console.");
  }
});

const searchBuses = () => {
  if (!searchDate.value || !searchRoute.value) {
    alert("Please select both date and route");
    return;
  }

  router.push({
    name: "BusList",
    query: { date: searchDate.value, route: searchRoute.value }
  });
};
</script>