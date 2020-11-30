import Vue from "vue";
import App from "./App.vue";
import router from "@/router";

import store from "@/store";

import axios from "axios";
// check token
let token = localStorage.getItem("token")
  ? JSON.parse(localStorage.getItem("token"))
  : null;
if (token) {
  axios.defaults.headers.common[
    "Authorization"
  ] = `${token.token_type} ${token.access_token}`;
}

// import sass style
import "@/assets/styles/index.scss";

// import filter
import "@/filters/date.js";

Vue.config.productionTip = false;

// Vue initialization
new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
