import { useStore } from "@/stores/store";
import HomeView from "@/views/HomeView.vue";
import {
  createRouter,
  createWebHistory,
  type NavigationGuard,
} from "vue-router";
import LandingView from "../views/LandingView.vue";

const restoreSession: NavigationGuard = async (to, from, next) => {
  const store = useStore();
  if (to.query.access_code) {
    try {
      await store.exchangeAccessCode(to.query.access_code as string);
    } catch (error) {
      console.warn("access code exchange failed");
    }
    next("/");
  } else {
    next();
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: "landing",
      path: "/",
      component: LandingView,
      beforeEnter: restoreSession,
    },
    {
      name: "home",
      path: "/home",
      component: HomeView,
    },
  ],
});

export default router;
