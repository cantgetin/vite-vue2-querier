import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/outEcpView",
    name: "outEcpView",
    component: () => import("../components/outEcpView.vue"),
  },
  {
    path: "/orgTypeNumber",
    name: "orgTypeNumber",
    component: () => import("../components/orgTypeNumber.vue"),
  },
  {
    path: "/orgTypes",
    name: "orgTypes",
    component: () => import("../components/orgTypes.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
