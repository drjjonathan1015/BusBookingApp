<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 transition-colors">
    <div class="bg-white dark:bg-gray-700 p-8 rounded shadow-md w-full max-w-md transition-colors">
      <h2 class="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">Bus Owner Registration</h2>
      
      <input v-model="ownerName" type="text" placeholder="Owner Name"
        class="border dark:border-gray-600 dark:bg-gray-600 dark:text-white p-2 mb-2 w-full rounded" />
      
      <input v-model="companyName" type="text" placeholder="Company/Bus Service Name"
        class="border dark:border-gray-600 dark:bg-gray-600 dark:text-white p-2 mb-2 w-full rounded" />
      
      <input v-model="email" type="email" placeholder="Email"
        class="border dark:border-gray-600 dark:bg-gray-600 dark:text-white p-2 mb-2 w-full rounded" />
      
      <input v-model="mobile" type="tel" placeholder="Mobile Number"
        class="border dark:border-gray-600 dark:bg-gray-600 dark:text-white p-2 mb-2 w-full rounded" />
      
      <input v-model="licenseNo" type="text" placeholder="Business License No"
        class="border dark:border-gray-600 dark:bg-gray-600 dark:text-white p-2 mb-2 w-full rounded" />
      
      <input v-model="password" type="password" placeholder="Password"
        class="border dark:border-gray-600 dark:bg-gray-600 dark:text-white p-2 mb-2 w-full rounded" />
      
      <input v-model="confirmPassword" type="password" placeholder="Confirm Password"
        class="border dark:border-gray-600 dark:bg-gray-600 dark:text-white p-2 mb-4 w-full rounded" />
      
      <button @click="registerOwner"
        class="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition">
        Register as Bus Owner
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
import { auth } from "../firebase/index";
import { db } from "../firebase/db";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "vue-router";
import { useHead } from "@vueuse/head";

useHead({
  title: "Bus Owner Registration | Bus Booking App",
  meta: [
    {
      name: "description",
      content: "Register as a bus owner to manage your fleet on our platform."
    }
  ]
});

const router = useRouter();
const ownerName = ref("");
const companyName = ref("");
const email = ref("");
const mobile = ref("");
const licenseNo = ref("");
const password = ref("");
const confirmPassword = ref("");

const registerOwner = async () => {
  // Validate inputs
  if (!ownerName.value || !email.value || !mobile.value || !password.value || !companyName.value || !licenseNo.value) {
    alert("Please fill all fields");
    return;
  }

  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match");
    return;
  }

  if (password.value.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth, email.value, password.value
    );

    const uid = userCredential.user.uid;

    // Save bus owner info in Firestore
    await setDoc(doc(db, "users", uid), {
      name: ownerName.value,
      companyName: companyName.value,
      email: email.value,
      mobile: mobile.value,
      licenseNo: licenseNo.value,
      role: "admin",
      createdAt: new Date(),
      verified: false // Admin can verify later
    });

    alert("✅ Bus Owner registration successful! Please login.");
    router.push("/login");
  } catch (err) {
    alert(err.message);
  }
};
</script>