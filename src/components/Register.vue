<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4 text-center">Register</h2>
      
      <input v-model="name" type="text" placeholder="Full Name" class="border p-2 mb-2 w-full rounded" />
      <input v-model="email" type="email" placeholder="Email" class="border p-2 mb-2 w-full rounded" />
      <input v-model="mobile" type="tel" placeholder="Mobile (+94XXXXXXXXX)" class="border p-2 mb-2 w-full rounded" />
      <input v-model="password" type="password" placeholder="Password" class="border p-2 mb-2 w-full rounded" />
      <input v-model="confirmPassword" type="password" placeholder="Confirm Password" class="border p-2 mb-4 w-full rounded" />

      <button @click="registerUser"
              class="bg-blue-600 text-white px-4 py-2 rounded w-full mt-2">
        Register
      </button>

      <p class="text-center mt-4 text-sm">
        Already have an account? 
        <router-link to="/login" class="text-blue-600 underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { auth } from "../firebase/index";
import { db } from "../firebase/db";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export default {
  data() {
    return {
      name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: ""
    };
  },
  methods: {
    async registerUser() {
      if (!this.name || !this.email || !this.mobile || !this.password || !this.confirmPassword) {
        alert("Please fill all fields");
        return;
      }
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const uid = userCredential.user.uid;

        await setDoc(doc(db, "users", uid), {
          name: this.name,
          email: this.email,
          mobile: this.mobile,
          role: "customer",
          createdAt: new Date()
        });

        alert("✅ Registration successful!");
        this.$router.push("/login");
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    }
  }
};
</script>
