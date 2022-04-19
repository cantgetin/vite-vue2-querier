import axios from "axios";
export default () => {
  return axios.create({
    baseURL: "http://querier-server:3080",
  });
};