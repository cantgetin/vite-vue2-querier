<template>
  <div>
    <div class="divHead">
      <h2>Расчет КИД</h2>
    </div>
    <b-table
      class="table text-center tb shadow p-3 mb-5 bg-white rounded"
      striped
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
      sortBy: "name",
      sortDesc: false,
      tableFields: [
        {
          key: "name",
          label: "Исполнитель",
        },
        {
          key: "sum",
          label: "Поручения",
        },
        {
          key: "coefficient",
          label: "Вид контроля",
        },
        {
          key: "good",
          label: "Выполненные в срок",
        },
        {
          key: "bad/daysoverdue",
          label: "Просроченные/дни просрочки",
          sortable: true,
        },
        {
          key: "unfinished",
          label: "Не выполненные",
        },
        {
          key: "KID",
          label: "КИД",
          sortable: true,
        },
        {
          key: "FinalKID",
          label: "Общий КИД",
          sortable: true,
        },
      ],
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
