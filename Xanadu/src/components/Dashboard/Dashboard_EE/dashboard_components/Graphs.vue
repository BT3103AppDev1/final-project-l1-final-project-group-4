<template>
  <div>
    <div>
      <h1>Dashboard</h1>

      <div class="pieChart">
        <h4>Money Spent by Product Category</h4>
        <MarketplacePieChartVue :salesData="salesData" />
      </div>
    </div>
  </div>
</template>

<script>
import MarketplacePieChartVue from "./graphs_components/MarketplacePieChart.vue";

export default {
  components: {
    MarketplacePieChartVue,
  },
  props: {
    salesData: Object,
    highestEarningCategories: Array,
  },
  watch: {
    salesData(data) {
      // console.log(
      //   "purchasesData has been passed from Dashboard.vue to Graphs.vue. This is purchasesData:"
      // );
      // console.log(data);
    },
  },
};
</script>

<style scoped>
.pieChart {
  width: 23%;
  height: 100%;
  flex-shrink: 0;
  float: left;
  margin-right: 18.5%;
}

.cards {
  margin-top: 4rem;
  width: 20%;
  height: 100%;
  flex-shrink: 0;
  float: left;
  margin-right: 2%;
}

.activityChart {
  width: 33%;
  height: 100%;
  flex-shrink: 0;
  float: left;
}
</style>
