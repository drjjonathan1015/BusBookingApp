<template>
  <div class="p-5 max-w-md mx-auto">
    <h2 class="text-2xl mb-4">Login</h2>
    <input v-model="email" placeholder="Email" class="border p-2 mb-2 w-full"/>
    <input v-model="password" placeholder="Password" type="password" class="border p-2 mb-2 w-full"/>
    <button @click="login" class="bg-blue-500 text-white px-4 py-2 w-full rounded">
      Login
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { auth } from "../firebase/index";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

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
