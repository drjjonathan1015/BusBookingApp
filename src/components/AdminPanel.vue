<template>
  <div class="max-w-7xl mx-auto mt-6 sm:mt-10 px-4 pb-8">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 dark:text-white transition-colors">
      🎛️ Admin Dashboard
    </h1>

    <!-- Tab Navigation -->
    <div class="mb-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex flex-wrap gap-2 sm:gap-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 font-semibold transition-colors text-sm sm:text-base',
            activeTab === tab.id
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          ]"
        >
          {{ tab.icon }} {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- Statistics Overview -->
    <div v-if="activeTab === 'overview'" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 rounded-lg p-4 sm:p-6 text-white shadow-lg">
          <p class="text-xs sm:text-sm opacity-90">Total Buses</p>
          <p class="text-2xl sm:text-3xl font-bold mt-2">{{ stats.totalBuses }}</p>
        </div>
        <div class="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-700 dark:to-green-800 rounded-lg p-4 sm:p-6 text-white shadow-lg">
          <p class="text-xs sm:text-sm opacity-90">Total Bookings</p>
          <p class="text-2xl sm:text-3xl font-bold mt-2">{{ stats.totalBookings }}</p>
        </div>
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-700 dark:to-purple-800 rounded-lg p-4 sm:p-6 text-white shadow-lg">
          <p class="text-xs sm:text-sm opacity-90">Total Revenue</p>
          <p class="text-2xl sm:text-3xl font-bold mt-2">Rs {{ stats.totalRevenue.toLocaleString() }}</p>
        </div>
        <div class="bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-700 dark:to-orange-800 rounded-lg p-4 sm:p-6 text-white shadow-lg">
          <p class="text-xs sm:text-sm opacity-90">Active Routes</p>
          <p class="text-2xl sm:text-3xl font-bold mt-2">{{ stats.activeRoutes }}</p>
        </div>
      </div>

      <!-- Recent Bookings -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors">
        <h2 class="text-lg sm:text-xl font-bold mb-4 text-gray-800 dark:text-white">📋 Recent Bookings</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-xs sm:text-sm">
            <thead class="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th class="p-2 text-left">Passenger</th>
                <th class="p-2 text-left">Route</th>
                <th class="p-2 text-left">Date</th>
                <th class="p-2 text-left">Seats</th>
                <th class="p-2 text-left">Amount</th>
                <th class="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in recentBookings" :key="booking.id" class="border-b dark:border-gray-700">
                <td class="p-2 text-gray-700 dark:text-gray-300">{{ booking.name || booking.email }}</td>
                <td class="p-2 text-gray-700 dark:text-gray-300">{{ booking.busRoute }}</td>
                <td class="p-2 text-gray-700 dark:text-gray-300">{{ booking.date }}</td>
                <td class="p-2 text-gray-700 dark:text-gray-300">{{ booking.seats.join(', ') }}</td>
                <td class="p-2 text-gray-700 dark:text-gray-300">Rs {{ booking.totalAmount }}</td>
                <td class="p-2">
                  <span :class="booking.status === 'CONFIRMED' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'">
                    {{ booking.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Manage Buses Tab -->
    <div v-if="activeTab === 'buses'" class="space-y-6">
      <!-- Add Bus Button -->
      <button
        @click="showAddBusForm = !showAddBusForm"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base"
      >
        {{ showAddBusForm ? '❌ Cancel' : '➕ Add New Bus' }}
      </button>

      <!-- Add/Edit Bus Form -->
      <div v-if="showAddBusForm" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors">
        <h3 class="text-lg sm:text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {{ editingBus ? '✏️ Edit Bus' : '➕ Add New Bus' }}
        </h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bus Number</label>
            <input v-model="busForm.busNo" class="w-full border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base" />
          </div>
          <div>
            <label class="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Route</label>
            <input v-model="busForm.route" placeholder="Colombo to Batticaloa" class="w-full border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base" />
          </div>
          <div>
            <label class="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">From</label>
            <input v-model="busForm.from" class="w-full border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base" />
          </div>
          <div>
            <label class="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">To</label>
            <input v-model="busForm.to" class="w-full border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base" />
          </div>
          <div>
            <label class="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Departure Time</label>
            <input v-model="busForm.time" type="time" class="w-full border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base" />
          </div>
          <div>
            <label class="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Price (Rs)</label>
            <input v-model="busForm.price" type="number" class="w-full border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base" />
          </div>
          <div>
            <label class="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Total Seats</label>
            <input v-model="busForm.totalSeats" type="number" class="w-full border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base" />
          </div>
          <div class="flex items-center">
            <input v-model="busForm.active" type="checkbox" class="mr-2" />
            <label class="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Active</label>
          </div>
        </div>

        <div class="flex gap-3 mt-4">
          <button @click="saveBus" class="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition text-sm sm:text-base">
            {{ editingBus ? '💾 Update' : '➕ Add' }} Bus
          </button>
          <button @click="cancelBusForm" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition text-sm sm:text-base">
            ❌ Cancel
          </button>
        </div>
      </div>

      <!-- Bus List -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors">
        <h3 class="text-lg sm:text-xl font-bold mb-4 text-gray-800 dark:text-white">🚌 All Buses</h3>
        <div class="space-y-3">
          <div v-for="bus in buses" :key="bus.id" class="border dark:border-gray-700 rounded-lg p-3 sm:p-4 hover:shadow-md transition">
            <div class="flex flex-col sm:flex-row justify-between gap-3">
              <div class="flex-1">
                <h4 class="font-bold text-blue-600 dark:text-blue-400 text-sm sm:text-base">{{ bus.route }}</h4>
                <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                  <p>🚌 Bus No: {{ bus.busNo }} | ⏰ {{ bus.time }}</p>
                  <p>💺 Seats: {{ bus.totalSeats }} | 💰 Rs {{ bus.price }}</p>
                  <p>📍 {{ bus.from }} → {{ bus.to }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <button @click="editBus(bus)" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs sm:text-sm">
                  ✏️ Edit
                </button>
                <button @click="toggleBusStatus(bus)" :class="bus.active ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'" class="text-white px-3 py-1 rounded text-xs sm:text-sm">
                  {{ bus.active ? '🔒 Deactivate' : '✅ Activate' }}
                </button>
                <button @click="deleteBus(bus.id)" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs sm:text-sm">
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- All Bookings Tab -->
    <div v-if="activeTab === 'bookings'" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors">
      <h3 class="text-lg sm:text-xl font-bold mb-4 text-gray-800 dark:text-white">📋 All Bookings</h3>
      
      <!-- Filter -->
      <div class="mb-4 flex flex-col sm:flex-row gap-3">
        <input v-model="bookingSearch" placeholder="Search by name, email, or bus..." class="flex-1 border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base" />
        <select v-model="bookingFilter" class="border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
          <option value="all">All Status</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-xs sm:text-sm">
          <thead class="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th class="p-2 text-left">Date</th>
              <th class="p-2 text-left">Passenger</th>
              <th class="p-2 text-left">Contact</th>
              <th class="p-2 text-left">Bus Route</th>
              <th class="p-2 text-left">Seats</th>
              <th class="p-2 text-left">Amount</th>
              <th class="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="booking in filteredBookings" :key="booking.id" class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="p-2 text-gray-700 dark:text-gray-300">{{ booking.date }}</td>
              <td class="p-2 text-gray-700 dark:text-gray-300">{{ booking.name || 'N/A' }}</td>
              <td class="p-2 text-gray-700 dark:text-gray-300 text-xs">{{ booking.email }}</td>
              <td class="p-2 text-gray-700 dark:text-gray-300">{{ booking.busRoute }}</td>
              <td class="p-2 text-gray-700 dark:text-gray-300">{{ booking.seats.join(', ') }}</td>
              <td class="p-2 text-gray-700 dark:text-gray-300 font-semibold">Rs {{ booking.totalAmount }}</td>
              <td class="p-2">
                <span :class="booking.status === 'CONFIRMED' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'" class="font-semibold">
                  {{ booking.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../firebase/index";
import { db } from "../firebase/db";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import { useHead } from "@vueuse/head";

useHead({
  title: "Admin Dashboard | Bus Booking App",
  meta: [
    {
      name: "description",
      content: "Manage buses, bookings, and view statistics."
    }
  ]
});

const router = useRouter();
const activeTab = ref('overview');
const showAddBusForm = ref(false);
const editingBus = ref(null);

const tabs = [
  { id: 'overview', name: 'Overview', icon: '📊' },
  { id: 'buses', name: 'Manage Buses', icon: '🚌' },
  { id: 'bookings', name: 'All Bookings', icon: '📋' }
];

const stats = ref({
  totalBuses: 0,
  totalBookings: 0,
  totalRevenue: 0,
  activeRoutes: 0
});

const buses = ref([]);
const allBookings = ref([]);
const recentBookings = ref([]);
const bookingSearch = ref('');
const bookingFilter = ref('all');

const busForm = ref({
  busNo: '',
  route: '',
  from: '',
  to: '',
  time: '',
  price: '',
  totalSeats: 42,
  active: true
});

const filteredBookings = computed(() => {
  let filtered = allBookings.value;

  if (bookingFilter.value !== 'all') {
    filtered = filtered.filter(b => b.status === bookingFilter.value);
  }

  if (bookingSearch.value) {
    const search = bookingSearch.value.toLowerCase();
    filtered = filtered.filter(b =>
      (b.name || '').toLowerCase().includes(search) ||
      b.email.toLowerCase().includes(search) ||
      b.busRoute.toLowerCase().includes(search)
    );
  }

  return filtered;
});

onMounted(async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("Please login as admin");
    router.push("/login");
    return;
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists() || !['admin', 'bus_owner'].includes(userDoc.data().role)) {
    alert("Access denied. Admin only.");
    router.push("/");
    return;
  }

  await loadData();
});

const loadData = async () => {
  // Load buses
  const busSnapshot = await getDocs(collection(db, "buses"));
  buses.value = busSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Load bookings
  const bookingSnapshot = await getDocs(collection(db, "bookings"));
  allBookings.value = bookingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Sort by timestamp (newest first)
  allBookings.value.sort((a, b) => {
    const timeA = a.timestamp?.toMillis() || 0;
    const timeB = b.timestamp?.toMillis() || 0;
    return timeB - timeA;
  });

  recentBookings.value = allBookings.value.slice(0, 5);

  // Calculate stats
  stats.value.totalBuses = buses.value.length;
  stats.value.totalBookings = allBookings.value.length;
  stats.value.totalRevenue = allBookings.value.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  stats.value.activeRoutes = new Set(buses.value.map(b => `${b.from}-${b.to}`)).size;
};

const saveBus = async () => {
  if (!busForm.value.busNo || !busForm.value.from || !busForm.value.to) {
    alert("Please fill all required fields");
    return;
  }

  try {
    if (editingBus.value) {
      await updateDoc(doc(db, "buses", editingBus.value), busForm.value);
      alert("✅ Bus updated successfully!");
    } else {
      await addDoc(collection(db, "buses"), busForm.value);
      alert("✅ Bus added successfully!");
    }
    
    cancelBusForm();
    await loadData();
  } catch (error) {
    console.error("Error saving bus:", error);
    alert("Error saving bus: " + error.message);
  }
};

const editBus = (bus) => {
  editingBus.value = bus.id;
  busForm.value = { ...bus };
  showAddBusForm.value = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const toggleBusStatus = async (bus) => {
  try {
    await updateDoc(doc(db, "buses", bus.id), { active: !bus.active });
    alert(`✅ Bus ${bus.active ? 'deactivated' : 'activated'} successfully!`);
    await loadData();
  } catch (error) {
    alert("Error updating bus status: " + error.message);
  }
};

const deleteBus = async (busId) => {
  if (!confirm("Are you sure you want to delete this bus?")) return;

  try {
    await deleteDoc(doc(db, "buses", busId));
    alert("✅ Bus deleted successfully!");
    await loadData();
  } catch (error) {
    alert("Error deleting bus: " + error.message);
  }
};

const cancelBusForm = () => {
  showAddBusForm.value = false;
  editingBus.value = null;
  busForm.value = {
    busNo: '',
    route: '',
    from: '',
    to: '',
    time: '',
    price: '',
    totalSeats: 42,
    active: true
  };
};
</script>