// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import HomePage from "../components/Home.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import BookingHistory from "../components/BookingHistory.vue";
import AdminPanel from "../components/AdminPanel.vue";
import BusSearchPage from "../components/BusSearch.vue";
import BusListPage from "../components/BusList.vue";
import SeatSelection from "../components/SeatSelection.vue";
import AdminRegister from "../components/AdminRegister.vue";

const routes = [
  { 
    path: "/", 
    name: "Home", 
    component: HomePage 
  },
  { 
    path: "/search", 
    name: "BusSearch", 
    component: BusSearchPage 
  },
  { 
    path: "/buses", 
    name: "BusList", 
    component: BusListPage 
  },
  { 
    path: "/login", 
    name: "Login", 
    component: Login 
  },
  { 
    path: "/register", 
    name: "Register", 
    component: Register 
  },
  { 
    path: "/history", 
    name: "BookingHistory", 
    component: BookingHistory 
  },
  { 
    path: "/seat-selection", 
    name: "SeatSelection", 
    component: SeatSelection 
  },
  { 
    path: "/admin", 
    name: "Admin", 
    component: AdminPanel, 
    meta: { requiresAdmin: true } 
  },
  { 
    path: "/admin-register", 
    name: "AdminRegister", 
    component: AdminRegister 
  },
  { 
    path: "/:pathMatch(.*)*", 
    name: "NotFound", 
    redirect: "/" 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Admin route guard
router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAdmin) {
    next();
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("Login required");
      next({ name: "Login" });
      return;
    }

    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists() || snap.data().role !== "admin") {
      alert("Access denied");
      next({ name: "Home" });
      return;
    }

    next();
  });
});

export default router;