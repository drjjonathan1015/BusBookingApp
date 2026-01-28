<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
    <div class="flex flex-col items-center">
      <div class="loader mb-4"></div>
      <p class="text-gray-600 dark:text-gray-300 text-sm">
        Loading Bus Booking App...
      </p>
    </div>
  </div>
</template>

<style scoped>
.loader {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #ec4899;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
