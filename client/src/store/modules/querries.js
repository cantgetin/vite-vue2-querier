import Vue from "vue";
import Vuex from "vuex";
import querriesApi from "../../api/querriesApi";

Vue.use(Vuex);

const getDefaultState = () => {
    return {
    outEcpData: [],
    orgTypeNumber: [],
    orgTypes: [],
    status: 'empty'
    }
}

const state = getDefaultState()

const mutations = {
    resetState (state) {
        state = getDefaultState()
      },
  setOutEcpData: (state, data) => (state.outEcpData = data),
  setOrgTypeNumber: (state, data) => (state.orgTypeNumber = data),
  setOrgTypes: (state, data) => (state.orgTypes = data),
};

const actions = {
  async getOutEcp({ commit }, from, to) {
    const response = await querriesApi.getOutEcp(from, to);
    response.data.forEach(
      (element) =>
        (element.percentage = Math.floor(
          (element.ecpoutbox / element.outbox) * 100
        ))
    );
    commit("setOutEcpData", response.data);
  },
  async getOrgTypeNumber({ commit }) {
    const response = await querriesApi.getOrgTypeNumber();
    // console.log(response)
    commit("setOrgTypeNumber", response.data);
  },
  async getOrgTypes({ commit }) {
    const response = await querriesApi.getOrgTypes();
    // console.log(response)
    commit("setOrgTypes", response.data);
  },

  resetState ({commit}){
    commit('resetState')
},
};

const getters = {
  outEcpData: () => state.outEcpData,
  orgTypeNumber: () => state.orgTypeNumber,
  orgTypes: () => state.orgTypes,
};

export default {
  state,
  getters,
  actions,
  mutations,
};
