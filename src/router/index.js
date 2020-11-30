import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("@/views/Index.vue"),
  },
  {
    path: "/login",
    component: () => import("@/views/Auth/Login.vue"),
  },
  {
    path: "/poll/create",
    component: () => import("@/views/Poll/Create.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
