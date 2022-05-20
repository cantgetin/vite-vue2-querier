<template>
  <div>
    <div class="divHead">
      <h2>Расчет КИД</h2>
    </div>
    <div class="container shadow p-3 mb-3 bg-white rounded">
      <div class="controls">
        <div class="datePickers">
          <b-datepicker
            placeholder="От"
            v-model="date.dateValueFrom"
            :date-format-options="{
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }"
            menu-class="w-100"
            calendar-width="100%"
          >
          </b-datepicker>
          <b-datepicker
            placeholder="До"
            v-model="date.dateValueTo"
            :date-format-options="{
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }"
            menu-class="w-100"
            calendar-width="100%"
            @input="manageLoading(date)"
          >
          </b-datepicker>
        </div>
      </div>
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
  computed: {
    ...mapGetters(["solutionsFinalCoefGetter", "solutionsCoefGetter"]),
  },
  methods: {
    ...mapActions(["getFinalSolutions", "getSolutionsCoef","resetState"]),
    async manageLoading(date) {
      this.loading = true;
      await this.getFinalSolutions(date);
      console.log(date);
      this.loading = false;
    },
  },
  data() {
    return {
      sortBy: "name",
      sortDesc: false,
      date: {
        dateValueFrom: "",
        dateValueTo: "",
      },
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
