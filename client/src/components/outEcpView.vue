<template>
  <div class="about">
    <h2>
      Отчет по количеству входящих, исходящих, исходящих с ЭЦП и проценту
      подписанных документов
    </h2>
    <hr />
    <br />
    <h3 v-if="!date.dateValueTo.length">Выберите даты отчета</h3>
    <h3 v-if="outEcpData.length && date.dateValueTo.length">
      Нажмите "Скачать отчет", для загрузки
    </h3>
    <br />
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
        <div class="buttons">
          <b-spinner v-show="this.loading"></b-spinner>
          <download-excel
            v-if="outEcpData.length"
            :data="outEcpData"
            class="dlxls"
          >
            <b-button id="download" class="btn-success download">
              Скачать отчет
            </b-button>
            <b-tooltip show target="download"
              >Нажмите для скачивания отчета</b-tooltip
            >
          </download-excel>
        </div>
      </div>

      <br />
      <br />
    </div>
    <b-table
      v-if="date.dateValueFrom.length && date.dateValueTo.length"
      class="table tb shadow p-3 mb-5 bg-white rounded"
      striped
      label-sort-clear="Кликните, чтобы отменить сортировку"
      label-sort-asc=""
      label-sort-desc=""
      sort-direction="desc"
      :items="outEcpData"
      :fields="tableFields"
    >
    </b-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      loading: false,
      date: {
        dateValueFrom: "",
        dateValueTo: "",
      },
      tableFields: [
        {
          key: "org_name",
          label: "Организация",
        },
        {
          key: "inbox",
          label: "Входящие",
          class: "tableNumbers",
          sortable: true,
        },
        {
          key: "outbox",
          label: "Исходящие",
          class: "tableNumbers",
          sortable: true,
        },
        {
          key: "ecpoutbox",
          label: "Подписанные",
          sortable: true,
          class: "tableNumbers",
        },
        {
          key: "percentage",
          label: "Процент подписанных",
          sortable: true,
          class: "tableNumbers",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["outEcpData"]),
  },
  methods: {
    ...mapActions(["getOutEcp", "resetState"]),
    async manageLoading(date) {
      this.loading = true;
      await this.getOutEcp(date);
      this.loading = false;
    },
  },
};
</script>
<style scoped>
h3 {
  /* color: white; */
}
.about {
  margin-top: 1vh;
}
.controls {
  display: flex;
  width: 100%;
  flex-direction: row;
  gap: 1vw;
  justify-content: space-evenly;
}
.datePickers {
  display: flex;
  width: 100%;
  height: 4vh;
  justify-content: space-around;
  gap: 1vw;
  margin-left: 3vw;
}
.buttons {
  margin-right: 2vw;
  display: flex;
  gap: 1vw;
  font-weight: 550;
}
.btn-back {
  height: 4vh;
  width: 7vw;
}
.container {
  height: 7.5vh;
  width: 60vw;
}
.load {
  height: 4vh;
  width: 14vw;
  font-weight: 550;
  /* font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; */
  background-color: black;
}
.download {
  height: 4vh;
  width: 14vw;
  /* font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; */
  font-weight: 550;
}
.tb {
  text-align: start;
  vertical-align: middle;
  width: 60vw;
  margin: auto;
}
.dlxls {
  color: white;
}
.tableNumbers {
  text-align: center;
}
</style>
