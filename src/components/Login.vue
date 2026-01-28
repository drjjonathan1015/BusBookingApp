<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 transition-colors">
    <div class="p-5 max-w-md mx-auto bg-white dark:bg-gray-700 rounded-lg shadow-md transition-colors">
      <h2 class="text-2xl mb-4 text-gray-800 dark:text-white font-bold text-center">Login</h2>
      <input 
        v-model="email" 
        placeholder="Email" 
        class="border dark:border-gray-600 p-2 mb-2 w-full rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
      />
      <input 
        v-model="password" 
        placeholder="Password" 
        type="password" 
        class="border dark:border-gray-600 p-2 mb-2 w-full rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
      />
      <button 
        @click="login" 
        class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 w-full rounded transition"
      >
        Login
      </button>
      
      <p class="text-center mt-4 text-sm text-gray-700 dark:text-gray-300">
        Don't have an account? 
        <router-link to="/register" class="text-blue-600 dark:text-blue-400 underline">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { auth } from "../firebase/index";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import { useHead } from "@vueuse/head";

useHead({
  title: "Login | Bus Booking App",
  meta: [
    {
      name: "description",
      content: "Login to book bus tickets across Sri Lanka."
    }
  ]
});

const email = ref("");
const password = ref("");
const router = useRouter();

const login = async () => {
  if (!email.value || !password.value) {
    alert("Please enter email and password");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    alert("✅ Login successful!");
    router.push("/"); // redirect to home or bus list
  } catch (err) {
    console.error(err);
    alert("Login failed: " + err.message);
  }
};
</script>