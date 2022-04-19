<template>
  <div>
  <div class="divHead">
    <b-button class="btn-back" variant="dark" @click="$router.push('/')">Назад</b-button>
    <h2>Отчет по типам организаций</h2>
    </div>
    <b-table
      class="table tb shadow p-3 mb-5 bg-white rounded"
      striped
      label-sort-clear="Кликните, чтобы отменить сортировку"
      label-sort-asc=""
      label-sort-desc=""
     :items="orgTypes"
     :fields="tableFields"
     :sort-by="sortBy"
     :sort-desc="sortDesc"
    >
    </b-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  mounted() {
      this.getOrgTypes()
    },
    computed: {
        ...mapGetters(["orgTypes"]),
      },
    methods: {
        ...mapActions(["getOrgTypes"]),
      },
  data() {
    return {
        sortBy: 'case',
        sortDesc: true,
      tableFields: [
        {
          key: "name",
          label: "Организация",
        },
        {
          key: "case",
          label: "Тип организации",
          class: "tableNumbers",
          sortable: true,
          sortDirection: "last"
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
.divHead{
  margin-top: 1vh;
  margin-bottom: 1vh;
  display: flex;
  gap: 2vw;
  margin-left: 30vw;
}
</style>
