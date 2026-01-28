<template>
  <div class="grid grid-cols-3 gap-4 text-center mt-16">
    <div v-for="stat in stats" :key="stat.label">
      <p class="text-3xl font-bold text-pink-600">
        {{ stat.value }}
      </p>
      <p class="text-sm text-gray-600 dark:text-gray-300">
        {{ stat.label }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "../firebase/db";
import { collection, getDocs } from "firebase/firestore";

const stats = ref([
  { label: "Users", value: 0 },
  { label: "Buses", value: 0 },
  { label: "Routes", value: 0 },
]);

onMounted(async () => {
  stats.value[0].value = (await getDocs(collection(db, "users"))).size;
  stats.value[1].value = (await getDocs(collection(db, "buses"))).size;
  stats.value[2].value = new Set(
    (await getDocs(collection(db, "buses"))).docs.map(
      b => `${b.data().from}-${b.data().to}`
    )
  ).size;
});
</script>
