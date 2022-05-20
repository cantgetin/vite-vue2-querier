import api from "./api";
export default {
  getOutEcp(params) {
    // console.log(params)
    return api().get(`api/outEcp`, { params });
  },
  getOrgTypeNumber() {
    return api().get(`api/orgTypeNumber`);
  },
  getOrgTypes() {
    return api().get(`api/orgTypes`);
  },
  getSolutionsCoef(params) {
    return api().get(`api/solutionsCoef`, { params });
  },
  getSolutionsFinalCoef(params) {
    return api().get(`api/solutionsFinalCoef`, { params });
  },
};
