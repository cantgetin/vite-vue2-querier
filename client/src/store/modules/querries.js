import Vue from "vue";
import Vuex from "vuex";
import querriesApi from "../../api/querriesApi";

Vue.use(Vuex);

const getDefaultState = () => {
    return {
    outEcpData: [],
    orgTypeNumber: [],
    orgTypes: [],
    soltuionsCoef: [],
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
  setSolutionsCoef: (state, data) => (state.soltuionsCoef = data),
};

function calculateResultWithArg(
  coef,
  number_of_good_solutions,
  bad_solutions,
  day_overdue
) {
  var bad_solutions_calculated_score_sum = 0;
  var bad_solutions_number = 0;

  // высчитываем N * (0.5)^d для каждой строки
  // N - кол-во просроченных поручений, d - кол-во дней на сколько просрочили N поручений
  for (let i = 0; i < bad_solutions.length; i++) {
    var N = bad_solutions[i];
    var d = day_overdue[i];

    var row_score = N * Math.pow(0.5, d); // посчитали N * (0.5)^day

    bad_solutions_calculated_score_sum =
      +bad_solutions_calculated_score_sum + +row_score; // считаем сумму всех скоров
    bad_solutions_number = +bad_solutions_number + +N; // считаем кол-во просроченных поручений
  }

  var top = +number_of_good_solutions + +bad_solutions_calculated_score_sum; //числитель формулы

  var bot = +bad_solutions_number + +number_of_good_solutions; // знаменатель формулы

  return Math.pow(top / bot, coef).toFixed(2);
}

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
  async getSolutionsCoef({ commit }) {
    const response = await querriesApi.getSolutionsCoef();
    response.data.forEach(
      (element) =>
        (element.KID = calculateResultWithArg(element.coefficient,element.goodsolutionscount,
          element.badsolutionnumbers, element.badsolutiondaysoverdue)
        ));
    await commit("setSolutionsCoef", response.data);
    //console.log(response);
  },

  resetState ({commit}){
    commit('resetState')
},
};

const getters = {
  outEcpData: () => state.outEcpData,
  orgTypeNumber: () => state.orgTypeNumber,
  orgTypes: () => state.orgTypes,
  solutionsCoefGetter: () => state.soltuionsCoef,
};

export default {
  state,
  getters,
  actions,
  mutations,
};
