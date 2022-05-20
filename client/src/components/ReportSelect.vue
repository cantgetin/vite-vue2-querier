<template>
  <div class="base bg-white shadow">
    <div class="selector p-3 mb-3 rounded">
      <div class="heading">
        <h2>Выберите отчет</h2>
      </div>
      <b-button
        variant="outline-dark"
        class="btns"
        @click="getChosenReport('outEcp')"
        >Отчет по исходящим документам</b-button
      >
      <b-button
        variant="outline-dark"
        class="btns"
        @click="getChosenReport('orgTypes')"
        >Отчет по типам организаций</b-button
      >
      <b-button
        variant="outline-dark"
        class="btns"
        @click="getChosenReport('orgTypeNumber')"
        >Отчет по количеству организаций в типах</b-button
      >
      <b-button
        variant="outline-dark"
        class="btns"
        @click="getChosenReport('kidCoeff')"
        >КИД детализированынй</b-button
      >
      <b-button
        variant="outline-dark"
        class="btns"
        @click="getChosenReport('kidFinal')"
        >КИД</b-button
      >
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "ReportSelect",
  methods: {
    ...mapActions(["getChosenReport"]),
  },
};
</script>

<style>
.base {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  /* margin-top: 5vw; */
  /* margin: 0.5rem; */
}
.selector {
  /* margin-top: 6.85vh; */
  min-width: 235px;
  width: 17vw;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.btns {
  height: 60px;
  min-width: 204px;
  width: 100%;
}
</style>
