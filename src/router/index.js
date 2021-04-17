import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
// import Home from "../views/Home.composition.vue"; // made with composition api

const routes = [
  {
    path: "/:filter",
    name: "Home",
    component: Home,
    props: true,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to) => {
  const params = ["all", "active", "completed"];
  if (params.every((param) => param !== to.params.filter)) return "/all";
});

export default router;
