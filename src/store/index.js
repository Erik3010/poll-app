import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import auth from "@/store/modules/auth";
import poll from "@/store/modules/poll";

export default new Vuex.Store({
  modules: {
    auth,
    poll,
  },
});
