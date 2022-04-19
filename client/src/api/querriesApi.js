import api from './api'
export default {
    getOutEcp(params) {
        // console.log(params)
        return api().get(`outEcp`, {params})
    },
    getOrgTypeNumber() {
        return api().get(`orgTypeNumber`)
    },
    getOrgTypes() {
        return api().get(`orgTypes`)
    }
}


