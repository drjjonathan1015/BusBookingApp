<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4 text-center">Bus Owner Registration</h2>
      
      <input v-model="ownerName" type="text" placeholder="Owner Name"
        class="border p-2 mb-2 w-full rounded" />
      
      <input v-model="companyName" type="text" placeholder="Company/Bus Service Name"
        class="border p-2 mb-2 w-full rounded" />
      
      <input v-model="email" type="email" placeholder="Email"
        class="border p-2 mb-2 w-full rounded" />
      
      <input v-model="mobile" type="tel" placeholder="Mobile Number"
        class="border p-2 mb-2 w-full rounded" />
      
      <input v-model="licenseNo" type="text" placeholder="Business License No"
        class="border p-2 mb-2 w-full rounded" />
      
      <input v-model="password" type="password" placeholder="Password"
        class="border p-2 mb-2 w-full rounded" />
      
      <input v-model="confirmPassword" type="password" placeholder="Confirm Password"
        class="border p-2 mb-4 w-full rounded" />
      
      <button @click="registerOwner"
        class="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Register as Bus Owner
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
      ownerName: "",
      companyName: "",
      email: "",
      mobile: "",
      licenseNo: "",
      password: "",
      confirmPassword: ""
    };
  },
  methods: {
    async registerOwner() {
      // Validate inputs
      if (!this.ownerName || !this.email || !this.mobile || !this.password || !this.companyName || !this.licenseNo) {
        alert("Please fill all fields");
        return;
      }

      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      if (this.password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      try {
        // Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(
          auth, this.email, this.password
        );

        const uid = userCredential.user.uid;

        // Save bus owner info in Firestore
        await setDoc(doc(db, "users", uid), {
          name: this.ownerName,
          companyName: this.companyName,
          email: this.email,
          mobile: this.mobile,
          licenseNo: this.licenseNo,
          role: "admin",
          createdAt: new Date(),
          verified: false // Admin can verify later
        });

        alert("✅ Bus Owner registration successful! Please login.");
        this.$router.push("/login");
      } catch (err) {
        alert(err.message);
      }
    }
  }
};
</script>