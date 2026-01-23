<template>
  <div class="min-h-screen bg-gray-50">
    <!-- NAVBAR -->
    <nav class="bg-blue-600 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <router-link to="/" class="text-2xl font-bold hover:text-blue-200 transition">
            🚌 Bus Booking
          </router-link>
          
          <!-- Navigation Links -->
          <div class="flex gap-6 items-center">
            <template v-if="currentUser">
              <router-link to="/" class="hover:text-blue-200 transition">Home</router-link>
              <router-link to="/search" class="hover:text-blue-200 transition">Search Buses</router-link>
              <router-link to="/history" class="hover:text-blue-200 transition">My Bookings</router-link>
              <router-link v-if="isAdmin" to="/admin" class="hover:text-blue-200 font-semibold transition">
                Admin Panel
              </router-link>
              <button @click="logout" class="hover:text-blue-200 transition">Logout</button>
              <span class="text-blue-200 font-medium">👤 {{ userName }}</span>
            </template>
            <template v-else>
              <router-link to="/login" class="hover:text-blue-200 transition">Login</router-link>
              <router-link to="/register" class="hover:text-blue-200 transition">Register</router-link>
              <router-link to="/admin-register" class="hover:text-blue-200 transition">Bus Owner</router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- PAGE CONTENT -->
    <main class="min-h-[calc(100vh-8rem)]">
      <router-view />
    </main>

    <!-- FOOTER -->
    <footer class="bg-gray-800 text-white text-center py-6 mt-10">
      <p>&copy; 2025 Bus Booking System. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { auth } from './firebase/index';
import { db } from './firebase/db';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const currentUser = ref(null);
    const userName = ref('');
    const isAdmin = ref(false);
    const router = useRouter();

    const loadUserData = async (user) => {
      if (user) {
        currentUser.value = user;
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            userName.value = userData.name || 'User';
            isAdmin.value = userData.role === 'admin' || userData.role === 'bus_owner';
          }
        } catch (err) {
          console.error("Error loading user data:", err);
        }
      } else {
        currentUser.value = null;
        userName.value = '';
        isAdmin.value = false;
      }
    };

    onMounted(() => {
      auth.onAuthStateChanged(loadUserData);
    });

    const logout = async () => {
      try {
        await signOut(auth);
        alert("Logged out successfully");
        router.push('/login');
      } catch (err) {
        console.error("Logout error:", err);
        alert("Error logging out");
      }
    };

    return {
      currentUser,
      userName,
      isAdmin,
      logout
    };
  }
};
</script>