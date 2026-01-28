<template>
  <button @click="toggleDark" 
          class="p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
    {{ isDark ? '🌙' : '☀️' }}
  </button>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isDark = ref(false);

onMounted(() => {
  // Load saved preference from localStorage
  isDark.value = localStorage.getItem("darkMode") === "true";
  updateHtmlClass();
});

const updateHtmlClass = () => {
  if (isDark.value) {
    document.documentElement.classList.add("dark"); // important
  } else {
    document.documentElement.classList.remove("dark");
  }
};

const toggleDark = () => {
  isDark.value = !isDark.value;
  localStorage.setItem("darkMode", isDark.value);
  updateHtmlClass();
};
</script>
