<template>
  <div
    class="max-w-md mx-auto mt-6 sm:mt-10 bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-lg shadow-md transition-colors"
    data-aos="zoom-in"
  >
    <h1
      class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-blue-600 dark:text-blue-400 transition-colors"
      data-aos="fade-down"
    >
      <LottieSearch/> Search Buses
    </h1>

    <!-- From -->
    <div class="mb-4" data-aos="fade-up" data-aos-delay="200">
      <label class="block font-semibold mb-2 text-gray-700 dark:text-gray-200 transition-colors text-sm sm:text-base">
        From
      </label>
      <select
        v-model="fromCity"
        class="border dark:border-gray-600 p-2 sm:p-3 w-full rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors text-sm sm:text-base"
      >
        <option value="">-- Select Origin --</option>
        <option v-for="city in cities" :key="city" :value="city">
          {{ city }}
        </option>
      </select>
    </div>

    <!-- To -->
    <div class="mb-4" data-aos="fade-up" data-aos-delay="300">
      <label class="block font-semibold mb-2 text-gray-700 dark:text-gray-200 transition-colors text-sm sm:text-base">
        To
      </label>
      <select
        v-model="toCity"
        class="border dark:border-gray-600 p-2 sm:p-3 w-full rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors text-sm sm:text-base"
      >
        <option value="">-- Select Destination --</option>
        <option v-for="city in cities" :key="city" :value="city">
          {{ city }}
        </option>
      </select>
    </div>

    <!-- Date Picker -->
    <div class="mb-6" data-aos="fade-up" data-aos-delay="400">
      <label class="block font-semibold mb-2 text-gray-700 dark:text-gray-200 transition-colors text-sm sm:text-base">
        Travel Date
      </label>
      <input
        v-model="travelDate"
        type="date"
        :min="today"
        class="border dark:border-gray-600 p-2 sm:p-3 w-full rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors text-sm sm:text-base"
      />
    </div>

    <!-- Button -->
    <button
      @click="searchBuses"
      data-aos="zoom-in"
      data-aos-delay="500"
      class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg w-full font-semibold text-base sm:text-lg transition transform hover:scale-105 active:scale-95"
    >
      🔍 Search Buses
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/db";
import { useRouter } from "vue-router";
import { useHead } from "@vueuse/head";
import LottieSearch from "./LottieSearch.vue";

useHead({
  title: "Book Bus Tickets | Bus Booking App",
  meta: [
    {
      name: "description",
      content: "Search and book bus tickets between Colombo, Batticaloa and all major cities in Sri Lanka."
    }
  ]
});

const router = useRouter();
const fromCity = ref("");
const toCity = ref("");
const travelDate = ref("");
const cities = ref([]);

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

onMounted(async () => {
  // Set default date to today
  travelDate.value = today;

  try {
    const snapshot = await getDocs(collection(db, "buses"));
    const citySet = new Set();

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.from) citySet.add(data.from);
      if (data.to) citySet.add(data.to);
    });

    cities.value = Array.from(citySet).sort();
  } catch (error) {
    console.error("Error loading cities:", error);
  }
});

const searchBuses = () => {
  if (!fromCity.value || !toCity.value) {
    alert("Please select both origin and destination");
    return;
  }
  if (fromCity.value === toCity.value) {
    alert("Origin and destination cannot be the same");
    return;
  }
  if (!travelDate.value) {
    alert("Please select a travel date");
    return;
  }

  router.push({
    name: "BusList",
    query: {
      from: fromCity.value,
      to: toCity.value,
      date: travelDate.value
    }
  });
};
</script>