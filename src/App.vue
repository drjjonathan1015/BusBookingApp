<template>
  <!-- APP LOADER -->
  <AppLoader v-if="loading" />

  <!-- MAIN APP -->
  <div v-else class="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">

    <!-- NAVBAR -->
    <nav class="bg-blue-600 dark:bg-gray-800 text-white shadow-lg transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-16">

          <!-- LOGO -->
          <router-link
            to="/"
            class="flex items-center gap-2 text-xl sm:text-2xl font-bold hover:text-blue-200 transition"
          >
            <img
              :src="busIcon"
              alt="Bus Booking"
              class="w-7 h-7 sm:w-8 sm:h-8 transition-transform hover:scale-110"
            />
            <span class="hidden sm:inline">Bus Booking</span>
            <span class="sm:hidden">🚌</span>
          </router-link>

          <!-- DESKTOP NAV -->
          <div class="hidden md:flex gap-4 items-center">
            <template v-if="currentUser">
              <router-link to="/" class="hover:text-blue-200 transition">Home</router-link>
              <router-link to="/search" class="hover:text-blue-200 transition">Search</router-link>
              <router-link to="/history" class="hover:text-blue-200 transition">Bookings</router-link>
              <router-link to="/profile" class="hover:text-blue-200 transition">Profile</router-link>
              <router-link v-if="isAdmin" to="/admin" class="hover:text-blue-200 font-semibold transition">Admin</router-link>
              <button @click="logout" class="hover:text-blue-200 transition">Logout</button>
              <span class="text-blue-200 font-medium">👤 {{ userName }}</span>
            </template>
            <template v-else>
              <router-link to="/login" class="hover:text-blue-200 transition">Login</router-link>
              <router-link to="/register" class="hover:text-blue-200 transition">Register</router-link>
              <router-link to="/admin-register" class="hover:text-blue-200 transition">Bus Owner</router-link>
            </template>

            <!-- DARK MODE TOGGLE -->
            <button
              @click="toggleDark"
              class="p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all duration-300 hover:scale-110 active:scale-95"
              :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            >
              <span class="text-lg sm:text-xl">{{ isDark ? '☀️' : '🌙' }}</span>
            </button>
          </div>

          <!-- MOBILE MENU BUTTON -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded hover:bg-blue-700 dark:hover:bg-gray-700 transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- MOBILE MENU -->
        <div
          v-if="mobileMenuOpen"
          class="md:hidden pb-4 space-y-2 animate-slideDown"
        >
          <template v-if="currentUser">
            <router-link @click="mobileMenuOpen = false" to="/" class="block py-2 hover:text-blue-200 transition">Home</router-link>
            <router-link @click="mobileMenuOpen = false" to="/search" class="block py-2 hover:text-blue-200 transition">Search Buses</router-link>
            <router-link @click="mobileMenuOpen = false" to="/history" class="block py-2 hover:text-blue-200 transition">My Bookings</router-link>
            <router-link @click="mobileMenuOpen = false" to="/profile" class="block py-2 hover:text-blue-200 transition">My Profile</router-link>
            <router-link v-if="isAdmin" @click="mobileMenuOpen = false" to="/admin" class="block py-2 hover:text-blue-200 font-semibold transition">Admin Panel</router-link>
            <button @click="logout" class="block w-full text-left py-2 hover:text-blue-200 transition">Logout</button>
            <div class="pt-2 border-t border-blue-500 dark:border-gray-700">
              <span class="text-blue-200 font-medium text-sm">👤 {{ userName }}</span>
            </div>
          </template>
          <template v-else>
            <router-link @click="mobileMenuOpen = false" to="/login" class="block py-2 hover:text-blue-200 transition">Login</router-link>
            <router-link @click="mobileMenuOpen = false" to="/register" class="block py-2 hover:text-blue-200 transition">Register</router-link>
            <router-link @click="mobileMenuOpen = false" to="/admin-register" class="block py-2 hover:text-blue-200 transition">Bus Owner Registration</router-link>
          </template>
          
          <!-- DARK MODE TOGGLE (MOBILE) -->
          <button
            @click="toggleDark"
            class="w-full text-left py-2 hover:text-blue-200 transition flex items-center gap-2"
          >
            <span class="text-xl">{{ isDark ? '☀️' : '🌙' }}</span>
            <span>{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- PAGE CONTENT -->
    <main class="min-h-[calc(100vh-8rem)]">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- FOOTER -->
    <footer class="bg-gray-800 dark:bg-gray-900 text-white text-center py-4 sm:py-6 transition-colors duration-300">
      <p class="text-xs sm:text-sm">© 2025 Bus Booking System</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { auth } from "./firebase";
import { db } from "./firebase/db";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

import AppLoader from "./components/AppLoader.vue";
import busIcon from "./assets/bus-ticket.png";

/* ------------------ STATE ------------------ */
const loading = ref(true);
const currentUser = ref(null);
const userName = ref("");
const isAdmin = ref(false);
const mobileMenuOpen = ref(false);

// DARK MODE - Initialize from localStorage
const isDark = ref(false);

/* ------------------ METHODS ------------------ */
const updateDarkMode = () => {
  const htmlElement = document.documentElement;
  if (isDark.value) htmlElement.classList.add("dark");
  else htmlElement.classList.remove("dark");
};

const toggleDark = () => {
  isDark.value = !isDark.value;
  localStorage.setItem("darkMode", String(isDark.value));
  updateDarkMode();
};

const router = useRouter();

const logout = async () => {
  await signOut(auth);
  mobileMenuOpen.value = false;
  router.push("/login");
};

/* ------------------ LIFECYCLE ------------------ */
onMounted(() => {
  // Load dark mode preference
  const savedDarkMode = localStorage.getItem("darkMode");
  isDark.value = savedDarkMode === "true";
  updateDarkMode();

  // Fake loading animation
  setTimeout(() => {
    loading.value = false;
  }, 1000);

  // Auth state
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      currentUser.value = null;
      userName.value = "";
      isAdmin.value = false;
      return;
    }

    currentUser.value = user;

    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      const data = snap.data();
      userName.value = data.name || "User";
      isAdmin.value = ["admin", "bus_owner"].includes(data.role);
    }
  });

  // Close mobile menu when route changes
  router.afterEach(() => {
    mobileMenuOpen.value = false;
  });
});
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out;
}

/* Mobile touch optimization */
@media (hover: none) and (pointer: coarse) {
  button,
  a {
    -webkit-tap-highlight-color: rgba(59, 130, 246, 0.3);
  }
}
</style>