<template>
  <div>
    <div class="heading">
      <h2>Выберите отчет</h2>
    </div>
    <div class="home shadow p-3 mb-3 bg-white rounded">
      <b-button variant="dark" class="btns" @click="$router.push('outEcpView')"
        >Отчет по исходящим документам</b-button
      >
      <b-button variant="dark" class="btns" @click="$router.push('orgTypes')"
        >Отчет по типам организаций</b-button
      >
      <b-button
        variant="dark"
        class="btns"
        @click="$router.push('orgTypeNumber')"
        >Отчет по количеству организаций в типах</b-button
      >
      <b-button
        variant="dark"
        class="btns"
        @click="$router.push('solutionsCoef')"
        >Посчитать КИД</b-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style>
html{
  background-color: #F8F8F8;
}
h2{
  /* color: white; */
}
.home {
  min-width: 235px;
  width: 17vw;
  margin-left: 41vw;
  margin-top: 5vh;
  display: flex;
  flex-direction: column;
  gap: 1vw;
}
.heading {
  
  display: flex;
  margin-left: 42vw;
  margin-top: 20vh;
}
.btns {
  min-width: 204px;
  width: 15vw;
}
</style>
