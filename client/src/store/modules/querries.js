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
  resetState(state) {
    state = getDefaultState()
  },
  setOutEcpData: (state, data) => (state.outEcpData = data),
  setOrgTypeNumber: (state, data) => (state.orgTypeNumber = data),
  setOrgTypes: (state, data) => (state.orgTypes = data),
  setSolutionsCoef: (state, data) => (state.soltuionsCoef = data),
};

function calculateKIDforCertainCoef(
  coef,
  number_of_good_solutions,
  bad_solutions,
  day_overdue
) {
  var bad_solutions_calculated_score_sum = 0;
  var bad_solutions_number = 0;


  if (bad_solutions == null) {
    // если просроченных нет, есть хорошие коэф = 1
    if (number_of_good_solutions > 0) return 1;
    // если никаких поручений не было, значит и коэф = 0
    else if (number_of_good_solutions == null) return 0;
  }

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

function calculateFinalKID(KID_coef1, KID_coef2, KID_coef3) {
  var significance321 = [0.5, 0.3, 0.2]
  var significance31 = [0.7, 0.3]
  var significance21 = [0.6, 0.4]
  var significance32 = [0.6, 0.4]
  var significanceOne = [1]

  if ((KID_coef3 != 0) & (KID_coef2 != 0) & (KID_coef1 != 0))
    return (significance321[0] * KID_coef3) + (significance321[1] * KID_coef2) + (significance321[2] * KID_coef1);
  else if ((KID_coef3 != 0) & (KID_coef2 == 0) & (KID_coef1 != 0))
    return (significance31[0] * KID_coef3) + (significance31[1] * KID_coef1);
  else if ((KID_coef3 == 0) & (KID_coef2 != 0) & (KID_coef1 != 0))
    return (significance21[0] * KID_coef2) + (significance21[1] * KID_coef1);
  else if ((KID_coef3 != 0) & (KID_coef2 != 0) & (KID_coef1 == 0))
    return (significance32[0] * KID_coef2) + (significance32[1] * KID_coef1);
  else return (significanceOne[0] * KID_coef3) + (significanceOne[0] * KID_coef2) + (significanceOne[0] * KID_coef1);

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
    response.data.forEach((element) => {
      element.KID_coef1 = calculateKIDforCertainCoef
        (1, element.good_solutions_number_coef1,
          element.bad_solutions_numbers_coef1,
          element.bad_solutions_days_overdue_coef1);

      element.KID_coef2 = calculateKIDforCertainCoef
        (2, element.good_solutions_number_coef2,
          element.bad_solutions_numbers_coef2,
          element.bad_solutions_days_overdue_coef2);

      element.KID_coef3 = calculateKIDforCertainCoef
        (3, element.good_solutions_number_coef3,
          element.bad_solutions_numbers_coef3,
          element.bad_solutions_days_overdue_coef3);

      element.KID_FINAL = calculateFinalKID(element.KID_coef1, element.KID_coef2, element.KID_coef3);
    })

    await commit("setSolutionsCoef", response.data);
    //console.log(response);
  },

  resetState({ commit }) {
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
