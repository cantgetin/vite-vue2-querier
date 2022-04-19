<template>
  <div>
    <div class="divHead">
    <b-button class="btn-back" variant="dark" @click="$router.push('/')">Назад</b-button>
    <h2>Отчет по количеству организаций в типе</h2>
    </div>
    <b-table
      class="table tb shadow p-3 mb-5 bg-white rounded"
      striped
      label-sort-clear="Кликните, чтобы отменить сортировку"
      label-sort-asc=""
      label-sort-desc=""
      :sort-by="sortBy"
      :sort-desc="sortDesc"

      :items="orgTypeNumber"
      :fields="tableFields"
    >
    </b-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
    mounted() {
      this.getOrgTypeNumber()
    },
    computed: {
        ...mapGetters(["orgTypeNumber"]),
      },
          
      methods: {
        ...mapActions(["getOrgTypeNumber"]),
      created() {
        getOrgTypeNumber()
      },
      },
  data() {
    return {
      sortBy: 'count',
      sortDesc: true,
      tableFields: [
      
        {
          key: "case",
          label: "Тип организации",
         
        },
          {
          key: "count",
          label: "Количество",
          class: "tableNumbers",
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
.divHead{
  margin-top: 1vh;
  margin-bottom: 1vh;
  display: flex;
  gap: 2vw;
  margin-left: 26vw;
}
</style>
