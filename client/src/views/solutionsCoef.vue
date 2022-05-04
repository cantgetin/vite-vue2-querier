<template>
  <div>
    <div class="divHead">
      <b-button class="btn-back" variant="dark" @click="$router.push('/')"
        >Назад</b-button
      >
      <h2>Рассчет КИД</h2>
    </div>
    <b-table
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      :items="solutionsCoefGetter"
      :fields="tableFields"
    >
    </b-table>
    
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  mounted() {
    this.getSolutionsCoef();
  },
  computed: {
    ...mapGetters(["solutionsCoefGetter"]),
  },
  methods: {
    ...mapActions(["getSolutionsCoef"]),
  },
  data() {
    return {
      sortBy: "case",
      sortDesc: true,
      tableFields: [
        {
          key: "executor_id",
        },
        {
          key: "coefficient",
        },
        {
          key: "goodsolutionscount",
        },
        {
          key: "badsolutionnumbers",
        },
        {
          key: "badsolutiondaysoverdue",
        },
        {
          key: "KID",
        },
      ]
    };
  },
};
</script>

<style>
.tb {
  text-align: start;
  vertical-align: middle;
  width: 60vw;
  margin: auto;
}
.divHead {
  margin-top: 1vh;
  margin-bottom: 1vh;
  display: flex;
  gap: 2vw;
  margin-left: 30vw;
}
</style>
