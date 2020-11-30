import axios from "axios";
import { env } from "@/env.js";

export default {
  namespaced: true,
  state: {
    user: {},
    token: localStorage.getItem("token") || null,
  },
  getters: {
    getUser: (state) => state.user,
    getToken: (state) => JSON.parse(state.token),
    isLoggedIn: (state) => !!state.token,
    getInitial: (state) => {
      /**
       * Get initial name in Javascript
       * https://stackoverflow.com/questions/33076177/getting-name-initials-using-js
       * Stackoverflow
       */
      if (!state.user.username) return;
      let initials = state.user.username.match(/\b\w/g) || [];
      return (initials = (
        (initials.shift() || "") + (initials.pop() || "")
      ).toUpperCase());
    },
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
  },
  actions: {
    async me({ commit, getters }) {
      const user = await axios.post(`${env.url}/auth/me`);
      commit("SET_USER", user.data);
      // console.log(user.data);
    },
    login({ commit, dispatch }, user) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${env.url}/auth/login`, user)
          .then((res) => {
            commit("SET_TOKEN", res.data);
            localStorage.setItem("token", JSON.stringify(res.data));
            axios.defaults.headers.common[
              "Authorization"
            ] = `${res.data.token_type} ${res.data.access_token}`;
            resolve(res);
          })
          .catch((err) => {
            localStorage.removeItem("token");
            reject(err);
          });
      });
    },
    logout({ commit, getters }) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${env.url}/auth/logout`)
          .then((res) => {
            commit("SET_USER", {});
            commit("SET_TOKEN", {});
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
};
