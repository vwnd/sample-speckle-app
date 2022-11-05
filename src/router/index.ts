import { createRouter, createWebHistory } from "vue-router";
import LandingView from "../views/LandingView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: "landing",
      path: "/",
      component: LandingView,
    },
  ],
});

export default router;
