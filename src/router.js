import { createRouter, createWebHistory } from "vue-router";

import Home from "./components/Home.vue";
import BusList from "./components/BusList.vue";
import BusSearch from "./components/BusSearch.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import BookingHistory from "./components/BookingHistory.vue";
import AdminPanel from "./components/AdminPanel.vue";
import AdminRegister from "./components/AdminRegister.vue";
import SeatSelection from "./components/SeatSelection.vue";

const routes = [
  { path: "/", name: "Home", component: Home },  // ✅ FIXED - Home component on root
  { path: "/search", name: "BusSearch", component: BusSearch },
  { path: "/buses", name: "BusList", component: BusList },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/history", name: "BookingHistory", component: BookingHistory },
  { path: "/admin", name: "Admin", component: AdminPanel },
  { path: "/admin-register", name: "AdminRegister", component: AdminRegister },
  { path: "/seat-selection", name: "SeatSelection", component: SeatSelection },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;