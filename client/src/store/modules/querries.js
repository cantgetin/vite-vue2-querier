import Vue from "vue";
import Vuex from "vuex";
import querriesApi from "../../api/querriesApi";

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    outEcpData: [],
    orgTypeNumber: [],
    orgTypes: [],
    solutionsCoef: [],
    solutionsFinalCoef: [],
    finalKid: [],
    status: "empty",
  };
};

const state = getDefaultState();

const mutations = {
  resetState(state) {
    state = getDefaultState();
  },
  setOutEcpData: (state, data) => (state.outEcpData = data),
  setOrgTypeNumber: (state, data) => (state.orgTypeNumber = data),
  setOrgTypes: (state, data) => (state.orgTypes = data),
  setSolutionsCoef: (state, data) => (state.solutionsCoef = data),
  setSolutionsFinalCoef: (state, data) => (state.solutionsFinalCoef = data),
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

  resetState({ commit }) {
    commit("resetState");
  },

  async getSolutionsCoef({ commit }, from, to) {
    const response = await querriesApi.getSolutionsCoef(from, to);

    response.data.forEach((element) => {
      element.KID = calculateKIDforCertainCoef(
        element.coefficient,
        element.good,
        element["bad/daysoverdue"]
      );
    });

    for (let i = 0; i < response.data.length; i++) {
      var currentName = response.data[i].name;
      var rowsWithCurrentName = response.data.filter((obj) => {
        return obj.name === currentName;
      });

      var rowKid1 = rowsWithCurrentName.find((obj) => {
        return obj.coefficient === 1;
      });

      var rowKid2 = rowsWithCurrentName.find((obj) => {
        return obj.coefficient === 2;
      });

      var rowKid3 = rowsWithCurrentName.find((obj) => {
        return obj.coefficient === 3;
      });

      if (rowKid1 == undefined) rowKid1 = { KID: 0, lol: "no" };
      if (rowKid2 == undefined) rowKid2 = { KID: 0, lol: "no" };
      if (rowKid3 == undefined) rowKid3 = { KID: 0, lol: "no" };

      // console.log(currentName, rowKid1, rowKid2, rowKid3);

      response.data[i].FinalKID = calculateFinalKID(
        rowKid1.KID,
        rowKid2.KID,
        rowKid3.KID
      ).toFixed(2);
    }

    response.data.forEach(function (o) {
      Object.keys(o).forEach(function (k) {
        if (o[k] === null) {
          o[k] = "-";
        }
      });
    });

    await commit("setSolutionsCoef", response.data);
    console.log(response.data);
  },

  async getFinalSolutions({ commit, dispatch }, from, to) {
    const responseFinal = await querriesApi.getSolutionsFinalCoef(from,to);
    const response = await querriesApi.getSolutionsCoef(from,to);

    response.data.forEach((element) => {
      element.KID = calculateKIDforCertainCoef(
        element.coefficient,
        element.good,
        element["bad/daysoverdue"]
      );
    });

    for (let i = 0; i < response.data.length; i++) {
      var currentName = response.data[i].name;
      var rowsWithCurrentName = response.data.filter((obj) => {
        return obj.name === currentName;
      });

      var rowKid1 = rowsWithCurrentName.find((obj) => {
        return obj.coefficient === 1;
      });

      var rowKid2 = rowsWithCurrentName.find((obj) => {
        return obj.coefficient === 2;
      });

      var rowKid3 = rowsWithCurrentName.find((obj) => {
        return obj.coefficient === 3;
      });

      if (rowKid1 == undefined) rowKid1 = { KID: 0, lol: "no" };
      if (rowKid2 == undefined) rowKid2 = { KID: 0, lol: "no" };
      if (rowKid3 == undefined) rowKid3 = { KID: 0, lol: "no" };

      // console.log(currentName, rowKid1, rowKid2, rowKid3);

      response.data[i].FinalKID = calculateFinalKID(
        rowKid1.KID,
        rowKid2.KID,
        rowKid3.KID
      ).toFixed(2);
    }

    response.data.forEach((element) => {
      const el = responseFinal.data.find((f) => f.name === element.name);
      if (el) {
        el.FinalKID = element.FinalKID;
      }
    });

    responseFinal.data.forEach(function (o) {
      Object.keys(o).forEach(function (k) {
        if (o[k] === null) {
          o[k] = "-";
        }
      });
    });

    commit("setSolutionsFinalCoef", responseFinal.data);
  },
};

const getters = {
  outEcpData: () => state.outEcpData,
  orgTypeNumber: () => state.orgTypeNumber,
  orgTypes: () => state.orgTypes,
  solutionsCoefGetter: () => state.solutionsCoef,
  solutionsFinalCoefGetter: () => state.solutionsFinalCoef,
};

function calculateKIDforCertainCoef(
  coef,
  number_of_good_solutions,
  bad_solutions_number_day_pairs
) {
  var bad_solutions_calculated_score_sum = 0;
  var bad_solutions_number = 0;

  if (bad_solutions_number_day_pairs == null) {
    // если просроченных нет, есть хорошие коэф = 1
    if (number_of_good_solutions > 0) return 1;
    // если никаких поручений не было, значит и коэф = 0
    else if (number_of_good_solutions == null) return 0;
  }

  // высчитываем N * (0.5)^d для каждой строки
  // N - кол-во просроченных поручений, d - кол-во дней на сколько просрочили N поручений
  for (let i = 0; i < bad_solutions_number_day_pairs.length; i++) {
    var N = bad_solutions_number_day_pairs[i][0];
    var d = bad_solutions_number_day_pairs[i][2];

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
  if ((KID_coef3 != 0) & (KID_coef2 != 0) & (KID_coef1 != 0))
    return 0.5 * KID_coef3 + 0.3 * KID_coef2 + 0.2 * KID_coef1;
  else if ((KID_coef3 != 0) & (KID_coef2 == 0) & (KID_coef1 != 0))
    return 0.7 * KID_coef3 + 0.3 * KID_coef1;
  else if ((KID_coef3 == 0) & (KID_coef2 != 0) & (KID_coef1 != 0))
    return 0.6 * KID_coef2 + 0.4 * KID_coef1;
  else if ((KID_coef3 != 0) & (KID_coef2 != 0) & (KID_coef1 == 0))
    return 0.6 * KID_coef3 + 0.4 * KID_coef2;
  else return 1 * KID_coef3 + 1 * KID_coef2 + 1 * KID_coef1;
}

export default {
  state,
  getters,
  actions,
  mutations,
};
