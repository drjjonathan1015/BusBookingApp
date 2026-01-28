<template>
  <div class="relative overflow-hidden min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">

    <!-- HERO -->
    <section class="text-center pt-16 px-4">
      <h1 class="text-4xl md:text-5xl font-extrabold text-blue-700 dark:text-blue-400 mb-4 transition-colors">
        Book Bus Tickets Effortlessly
      </h1>

      <!-- Lottie animation -->
      <LottieBus class="mx-auto w-72 h-72" />

      <p class="text-gray-600 dark:text-gray-300 text-lg mb-8 transition-colors">
        Fast • Secure • Comfortable journeys across Sri Lanka
      </p>

      <button
        class="bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-800 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition transform hover:scale-110"
        @click="$router.push('/search')"
      >
        Search Buses
      </button>
    </section>

    <!-- MOVING BUS -->
    <div class="relative mt-12 overflow-hidden h-32">
      <div class="absolute animate-bus-move">
        <LottieMove class="w-48" />
      </div>
    </div>

    <!-- ROUTES -->
    <section class="mt-12">
      <h2 class="text-center text-2xl font-bold text-gray-700 dark:text-gray-200 mb-6 transition-colors">
        Popular Routes
      </h2>

      <div class="overflow-hidden whitespace-nowrap">
        <div class="inline-block animate-route-slide">
          <span v-for="(route, i) in routes" :key="i" class="route-chip bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 transition-colors">
            {{ route }}
          </span>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto">
      <!-- Feature 1 -->
      <div class="feature-card bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-700 p-6 transition-all duration-300">
        <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2 transition-colors">
          Easy Booking
        </h3>
        <p class="text-gray-600 dark:text-gray-300 transition-colors">
          Choose seats and confirm instantly.
        </p>
      </div>

      <!-- Feature 2 -->
      <div class="feature-card bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-700 p-6 transition-all duration-300">
        <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2 transition-colors">
          Verified Buses
        </h3>
        <p class="text-gray-600 dark:text-gray-300 transition-colors">
          Trusted operators and live availability.
        </p>
      </div>

      <!-- Feature 3 -->
      <div class="feature-card bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-700 p-6 transition-all duration-300">
        <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2 transition-colors">
          Secure System
        </h3>
        <p class="text-gray-600 dark:text-gray-300 transition-colors">
          Firebase authentication & data security.
        </p>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="mt-24 text-center text-sm text-gray-500 dark:text-gray-400 pb-6 transition-colors duration-300">
      © 2026 Bus Booking App
    </footer>

  </div>
</template>

<script setup>
import LottieBus from "../components/LottieBus.vue";
import LottieMove from "../components/LottieMove.vue";

const routes = [
  "Colombo → Batticaloa",
  "Jaffna → Colombo",
  "Kandy → Galle",
  "Trincomalee → Colombo",
  "Kurunegala → Matara"
];
</script>

<style scoped>
/* Moving bus */
.animate-bus-move {
  animation: busMove 6s linear infinite;
}

@keyframes busMove {
  from { transform: translateX(-200px); }
  to { transform: translateX(110vw); }
}

/* Route slider */
.animate-route-slide {
  animation: slide 12s linear infinite;
}

@keyframes slide {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.route-chip {
  display: inline-block;
  padding: 10px 20px;
  margin: 0 10px;
  border-radius: 999px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  font-weight: 600;
}

/* Feature cards */
.feature-card:hover {
  transform: translateY(-8px);
}
</style>