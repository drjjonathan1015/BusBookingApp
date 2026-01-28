<template>
  <div class="feature-card">
    <h3 class="text-xl font-bold text-blue-600 mb-2">{{ title }}</h3>
    <p class="text-gray-600 dark:text-gray-300">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps(["title", "text"]);
</script>

<style scoped>
.feature-card {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  transition: transform 0.4s ease, opacity 0.4s ease;
  will-change: transform, opacity;
}

.feature-card:hover {
  transform: translateY(-10px) scale(1.04);
}

@media (prefers-color-scheme: dark) {
  .feature-card {
    background: rgb(31, 41, 55);
  }
}
</style>
