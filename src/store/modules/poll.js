import axios from "axios";
import { env } from "@/env.js";

export default {
  namespaced: true,
  state: {
    polls: [],
    poll: {},
  },
  getters: {
    getPolls: (state) => state.polls,
    getPoll: (state) => state.poll,
  },
  mutations: {
    SET_POLLS(state, polls) {
      state.polls = polls;
    },
    SET_POLL(state, poll) {
      state.poll = poll;
    },
  },
  actions: {
    fetchPolls({ commit }) {
      axios
        .get(`${env.url}/poll`)
        .then((res) => {
          commit("SET_POLLS", res.data);
        })
        .catch((err) => console.log(err));
    },
    fetchPoll({ commit }, pollId) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${env.url}/poll/${pollId}`)
          .then((res) => {
            commit("SET_POLL", res.data);
            resolve(res);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    vote({ commit, dispatch }, { pollId, choiceId }) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${env.url}/poll/${pollId}/vote/${choiceId}`)
          .then((res) => {
            // dispatch("fetchPoll", pollId);
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
};
