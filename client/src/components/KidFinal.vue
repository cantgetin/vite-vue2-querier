<template>
  <div>
    <div class="divHead">
      <h2>Расчет КИД</h2>
    </div>
    <b-table
      class="table text-center tb shadow p-3 mb-5 bg-white rounded"
      label-sort-clear="отменить сортировку"
      label-sort-asc=""
      label-sort-desc=""
      striped
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      :items="solutionsFinalCoefGetter"
      :fields="tableFields"
    >
    </b-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  mounted() {
    this.getFinalSolutions();
  },
  computed: {
    ...mapGetters(["solutionsFinalCoefGetter", "solutionsCoefGetter"]),
  },
  methods: {
    ...mapActions(["getFinalSolutions", "getSolutionsCoef"]),
  },
  data() {
    return {
      sortBy: "name",
      sortDesc: false,
      tableFields: [
        {
          key: "name",
          label: "Исполнитель",
          sortable: true,
        },
        {
          key: "quantity",
          label: "Поручения",
          sortable: true,
        },
        {
          key: "good",
          label: "Выполненные в срок",
          sortable: true,
        },
        {
          key: "bad",
          label: "Просроченные",
          sortable: true,
        },
        {
          key: "unfinished",
          label: "Не выполненные",
          sortable: true,
        },
        {
          key: "FinalKID",
          label: "КИД",
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
