import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const getDefaultState = () => {
  return {
    chosenReport: "",
  };
};

const state = getDefaultState();

const mutations = {
  setChosenReport: (state, data) => (state.chosenReport = data),
};

const actions = {
  getChosenReport({ commit }, report) {
    commit("setChosenReport", report);
  },
};

const getters = {
  chosenReport: () => state.chosenReport,
};

export default {
  state,
  getters,
  mutations,
  actions,
};
