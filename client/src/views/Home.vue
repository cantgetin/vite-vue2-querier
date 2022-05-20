<template>
  <div class="homepage">
    <report-select />
    <report-show>
      <org-types v-if="chosenReport == 'orgTypes'" />
      <org-type-number v-if="chosenReport == 'orgTypeNumber'" />
      <out-ecp-view v-if="chosenReport == 'outEcp'" />
      <kid-coeff v-if="chosenReport == 'kidCoeff'" />
      <kid-final v-if="chosenReport == 'kidFinal'" />
    </report-show>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ReportSelect from "../components/ReportSelect.vue";
import ReportShow from "../components/ReportShow.vue";
import outEcpView from "../components/outEcpView.vue";
import orgTypeNumber from "../components/orgTypeNumber.vue";
import orgTypes from "../components/orgTypes.vue";
import kidCoeff from "../components/KidCoeff.vue";
import kidFinal from "../components/KidFinal.vue";
export default {
  name: "Home",
  components: {
    ReportSelect,
    ReportShow,
    orgTypeNumber,
    orgTypes,
    outEcpView,
    kidCoeff,
    kidFinal,
  },
  computed: {
    ...mapGetters(["chosenReport"]),
  },
};
</script>

<style>
html {
  background-color: #f8f8f8;
}

.homepage {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
