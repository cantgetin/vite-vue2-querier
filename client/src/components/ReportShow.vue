<template>
  <div class="show overflow-scroll">
    <slot><h1>Выберите отчет для его отображения</h1></slot>
  </div>
</template>

<script>
import outEcpView from "./outEcpView.vue";
import orgTypeNumber from "./orgTypeNumber.vue";
import orgTypes from "./orgTypes.vue";
import kidCoeff from "./kidCoeff.vue";
import kidFinal from "./KidFinal.vue";
export default {
  name: "ReportShow",
  components: {
    orgTypeNumber,
    orgTypes,
    outEcpView,
    kidCoeff,
    kidFinal,
  },
};
</script>

<style>
.show {
  border-left: 1px solid #000;
  height: 100vh;
  width: 100%;
  /* margin: 0.5rem; */
  padding: 0.5rem;
  /* background-color: black; */
}
</style>
