import Vue from "vue";
import Vuex from "vuex";
import querries from "./modules/querries";
import reports from "./modules/reports";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    querries,
    reports,
  },
});
