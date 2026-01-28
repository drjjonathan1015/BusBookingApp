<template>
  <div class="max-w-4xl mx-auto mt-6 sm:mt-10 px-4 pb-8">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 dark:text-white transition-colors">
      👤 My Profile
    </h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      
      <!-- Left Column - Profile Info -->
      <div class="lg:col-span-2 space-y-4 sm:space-y-6">
        
        <!-- Personal Information Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">Personal Information</h2>
            <button
              v-if="!editMode"
              @click="editMode = true"
              class="text-blue-600 dark:text-blue-400 hover:underline text-sm sm:text-base"
            >
              ✏️ Edit
            </button>
          </div>

          <div v-if="!editMode" class="space-y-3">
            <div>
              <label class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Full Name</label>
              <p class="text-sm sm:text-base text-gray-800 dark:text-white font-medium">{{ userData.name }}</p>
            </div>
            <div>
              <label class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Email</label>
              <p class="text-sm sm:text-base text-gray-800 dark:text-white font-medium">{{ userData.email }}</p>
            </div>
            <div>
              <label class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Mobile</label>
              <p class="text-sm sm:text-base text-gray-800 dark:text-white font-medium">{{ userData.mobile || 'Not provided' }}</p>
            </div>
            <div>
              <label class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Member Since</label>
              <p class="text-sm sm:text-base text-gray-800 dark:text-white font-medium">{{ formatDate(userData.createdAt) }}</p>
            </div>
          </div>

          <!-- Edit Form -->
          <div v-else class="space-y-3 sm:space-y-4">
            <div>
              <label class="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                v-model="editData.name"
                class="w-full border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
              />
            </div>
            <div>
              <label class="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Mobile</label>
              <input
                v-model="editData.mobile"
                class="w-full border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
              />
            </div>
            <div class="flex gap-2 sm:gap-3 pt-2">
              <button
                @click="saveProfile"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded transition text-sm sm:text-base"
              >
                💾 Save
              </button>
              <button
                @click="cancelEdit"
                class="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 sm:px-4 py-2 rounded transition text-sm sm:text-base"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>

        <!-- Change Password Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors">
          <h2 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4">Change Password</h2>
          
          <div class="space-y-3 sm:space-y-4">
            <div>
              <label class="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Current Password</label>
              <input
                v-model="passwords.current"
                type="password"
                class="w-full border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
              />
            </div>
            <div>
              <label class="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">New Password</label>
              <input
                v-model="passwords.new"
                type="password"
                class="w-full border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
              />
            </div>
            <div>
              <label class="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Confirm New Password</label>
              <input
                v-model="passwords.confirm"
                type="password"
                class="w-full border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
              />
            </div>
            <button
              @click="changePassword"
              class="w-full bg-pink-600 hover:bg-pink-700 text-white px-3 sm:px-4 py-2 rounded transition text-sm sm:text-base"
            >
              🔒 Change Password
            </button>
          </div>
        </div>

      </div>

      <!-- Right Column - Statistics -->
      <div class="space-y-4 sm:space-y-6">
        
        <!-- Booking Stats -->
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 rounded-lg shadow-md p-4 sm:p-6 text-white transition-colors">
          <h3 class="text-base sm:text-lg font-bold mb-4">📊 Booking Statistics</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-xs sm:text-sm">Total Bookings</span>
              <span class="text-xl sm:text-2xl font-bold">{{ stats.totalBookings }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs sm:text-sm">Total Spent</span>
              <span class="text-xl sm:text-2xl font-bold">Rs {{ stats.totalSpent }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs sm:text-sm">Seats Booked</span>
              <span class="text-xl sm:text-2xl font-bold">{{ stats.totalSeats }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors">
          <h3 class="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-4">⚡ Quick Actions</h3>
          <div class="space-y-2 sm:space-y-3">
            <router-link
              to="/search"
              class="block w-full bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 rounded text-center transition text-sm sm:text-base"
            >
              🔍 Search Buses
            </router-link>
            <router-link
              to="/history"
              class="block w-full bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded text-center transition text-sm sm:text-base"
            >
              🎫 My Bookings
            </router-link>
            <button
              @click="logout"
              class="block w-full bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded text-center transition text-sm sm:text-base"
            >
              🚪 Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../firebase/index";
import { db } from "../firebase/db";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, signOut } from "firebase/auth";
import { useHead } from "@vueuse/head";

useHead({
  title: "My Profile | Bus Booking App",
  meta: [
    {
      name: "description",
      content: "Manage your profile and view booking statistics."
    }
  ]
});

const router = useRouter();
const loading = ref(true);
const editMode = ref(false);
const userData = ref({});
const editData = ref({});
const passwords = ref({
  current: "",
  new: "",
  confirm: ""
});
const stats = ref({
  totalBookings: 0,
  totalSpent: 0,
  totalSeats: 0
});

onMounted(async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("Please login to view profile");
    router.push("/login");
    return;
  }

  try {
    // Load user data
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      userData.value = { ...userDoc.data(), email: user.email };
      editData.value = { ...userData.value };
    }

    // Load booking statistics
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid)
    );
    const bookingsSnapshot = await getDocs(bookingsQuery);
    
    let totalSpent = 0;
    let totalSeats = 0;
    
    bookingsSnapshot.docs.forEach(doc => {
      const booking = doc.data();
      totalSpent += booking.totalAmount || 0;
      totalSeats += (booking.seats || []).length;
    });

    stats.value = {
      totalBookings: bookingsSnapshot.size,
      totalSpent,
      totalSeats
    };

  } catch (error) {
    console.error("Error loading profile:", error);
    alert("Error loading profile data");
  } finally {
    loading.value = false;
  }
});

const saveProfile = async () => {
  try {
    const user = auth.currentUser;
    await updateDoc(doc(db, "users", user.uid), {
      name: editData.value.name,
      mobile: editData.value.mobile
    });
    
    userData.value = { ...editData.value };
    editMode.value = false;
    alert("✅ Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Error updating profile: " + error.message);
  }
};

const cancelEdit = () => {
  editData.value = { ...userData.value };
  editMode.value = false;
};

const changePassword = async () => {
  if (!passwords.value.current || !passwords.value.new || !passwords.value.confirm) {
    alert("Please fill all password fields");
    return;
  }
  
  if (passwords.value.new !== passwords.value.confirm) {
    alert("New passwords do not match");
    return;
  }

  if (passwords.value.new.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, passwords.value.current);
    
    // Reauthenticate user
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await updatePassword(user, passwords.value.new);
    
    alert("✅ Password changed successfully!");
    passwords.value = { current: "", new: "", confirm: "" };
  } catch (error) {
    console.error("Error changing password:", error);
    if (error.code === "auth/wrong-password") {
      alert("Current password is incorrect");
    } else {
      alert("Error changing password: " + error.message);
    }
  }
};

const logout = async () => {
  await signOut(auth);
  router.push("/login");
};

const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });
};
</script>