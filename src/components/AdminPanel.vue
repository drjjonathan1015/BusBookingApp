<template>
  <div class="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
    <h1 class="text-2xl font-bold mb-6 text-center text-blue-600">
      🚌 Add New Bus
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input v-model="from" placeholder="From (e.g., Colombo)" class="border p-2 rounded" />
      <input v-model="to" placeholder="To (e.g., Kandy)" class="border p-2 rounded" />
      <input v-model="busNo" placeholder="Bus Number" class="border p-2 rounded" />
      <input v-model="date" type="date" class="border p-2 rounded" />
      <input v-model="time" type="time" class="border p-2 rounded" />
      <input v-model="price" type="number" placeholder="Ticket Price" class="border p-2 rounded" />
      <input v-model="totalSeats" type="number" placeholder="Total Seats" class="border p-2 rounded" />
    </div>

    <button
      @click="addBus"
      class="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg mt-6 font-semibold"
    >
      ➕ Add Bus
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/db";
import { useRouter } from "vue-router";

const router = useRouter();

const from = ref("");
const to = ref("");
const busNo = ref("");
const date = ref("");
const time = ref("");
const price = ref(500);
const totalSeats = ref(42);

const addBus = async () => {
  if (!from.value || !to.value || !busNo.value || !date.value || !time.value) {
    alert("Please fill all fields");
    return;
  }

  await addDoc(collection(db, "buses"), {
    from: from.value,
    to: to.value,
    route: `${from.value} → ${to.value}`,
    busNo: busNo.value,
    date: new Date(date.value),
    time: time.value,
    price: price.value,
    totalSeats: totalSeats.value,
    seatsAvailable: totalSeats.value,
    createdAt: new Date(),
  });

  alert("✅ Bus added successfully!");
  
  // Clear form
  from.value = "";
  to.value = "";
  busNo.value = "";
  date.value = "";
  time.value = "";
  price.value = 500;
  totalSeats.value = 42;
};
</script>