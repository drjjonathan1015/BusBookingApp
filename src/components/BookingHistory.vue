<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">My Bookings</h2>

    <div v-if="loading">Loading bookings...</div>

    <div v-else-if="bookings.length === 0">
      No bookings found.
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="booking in bookings"
        :key="booking.id"
        class="p-4 bg-white shadow rounded"
      >
        <p><strong>Bus:</strong> {{ booking.busRoute }}</p>
        <p><strong>Bus No:</strong> {{ booking.busNo }}</p>
        <p><strong>Date:</strong> {{ booking.date }} | {{ booking.time }}</p>
        <p><strong>Seats:</strong> {{ booking.seats.join(", ") }}</p>
        <p><strong>Total:</strong> Rs. {{ booking.totalAmount }}</p>
        <p class="text-green-600 font-semibold">{{ booking.status }}</p>
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
import { collection, query, where, getDocs } from "firebase/firestore";

const router = useRouter();

const bookings = ref([]);
const loading = ref(true);

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("Please login to view bookings");
      router.push("/login");
      return;
    }

    // 🔥 Fetch ONLY this user's bookings
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    bookings.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    loading.value = false;
  });
});
</script>
