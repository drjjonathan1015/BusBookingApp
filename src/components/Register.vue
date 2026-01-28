<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 transition-colors">
    <div class="bg-white dark:bg-gray-700 p-8 rounded shadow-md w-full max-w-md transition-colors">
      <h2 class="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">Register</h2>
      
      <input v-model="name" type="text" placeholder="Full Name" 
        class="border dark:border-gray-600 dark:bg-gray-600 dark:text-white p-2 mb-2 w-full rounded" />
      <input v-model="email" type="email" placeholder="Email" 
        class="border dark:border-gray-600 dark:bg-gray-600 dark:text-white p-2 mb-2 w-full rounded" />
      <input v-model="mobile" type="tel" placeholder="Mobile (+94XXXXXXXXX)" 
        class="border dark:border-gray-600 dark:bg-gray-600 dark:text-white p-2 mb-2 w-full rounded" />
      <input v-model="password" type="password" placeholder="Password" 
        class="border dark:border-gray-600 dark:bg-gray-600 dark:text-white p-2 mb-2 w-full rounded" />
      <input v-model="confirmPassword" type="password" placeholder="Confirm Password" 
        class="border dark:border-gray-600 dark:bg-gray-600 dark:text-white p-2 mb-4 w-full rounded" />

      <button @click="registerUser"
              class="bg-blue-600 text-white px-4 py-2 rounded w-full mt-2 hover:bg-blue-700 transition">
        Register
      </button>

      <p class="text-center mt-4 text-sm text-gray-700 dark:text-gray-300">
        Already have an account? 
        <router-link to="/login" class="text-blue-600 dark:text-blue-400 underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase/index";
import { db } from "../firebase/db";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "vue-router";
import { useHead } from "@vueuse/head";
import { updateProfile } from "firebase/auth";

useHead({
  title: "Register | Bus Booking App",
  meta: [
    {
      name: "description",
      content: "Register for a Bus Booking account to book tickets across Sri Lanka."
    }
  ]
});

const router = useRouter();
const name = ref("");
const email = ref("");
const mobile = ref("");
const password = ref("");
const confirmPassword = ref("");

const registerUser = async () => {
  if (!name.value || !email.value || !mobile.value || !password.value || !confirmPassword.value) {
    alert("Please fill all fields");
    return;
  }
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match");
    return;
  }

  try {
    // 1. Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    // ✅ SET DISPLAY NAME
await updateProfile(userCredential.user, {
  displayName: name.value
});
    const uid = userCredential.user.uid;

    // 2. Save user info in Firestore
    await setDoc(doc(db, "users", uid), {
      name: name.value,
      email: email.value,
      mobile: mobile.value,
      role: "customer",
      createdAt: new Date()
    });

    // 3. Send verification email (optional - user can still use the app)
    try {
      await sendEmailVerification(userCredential.user);
      alert(`✅ Registration successful! A verification email has been sent to ${email.value}`);
    } catch (err) {
      console.log("Email verification not sent:", err);
      alert(`✅ Registration successful! You can now login.`);
    }

    // Redirect to login
    router.push("/login");

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
</script>