<template>
  <div>
    <h1>Dashboard</h1>
    <div>
      <h4>Money Spent by Product Category</h4>
      <MarketplacePieChartVue :purchasesData="purchasesData" />
    </div>
    <ActivityChart :activityChartData="activityChartData" />
  </div>
</template>

<script>
import ActivityChart from "./graphs_components/ActivityChart.vue";
import MarketplacePieChartVue from "./graphs_components/MarketplacePieChart.vue";

export default {
  components: {
    ActivityChart,
    MarketplacePieChartVue,
  },
  props: {
    activityChartData: Object,
    purchasesData: Object,
  },
  watch: {
    activityChartData(data) {
      // console.log(
      //   "activityChartData has been passed from Dashboard.vue to Graphs.vue. This is activityChartData:"
      // );
      // console.log(data);
    },
    purchasesData(data) {
      // console.log(
      //   "purchasesData has been passed from Dashboard.vue to Graphs.vue. This is purchasesData:"
      // );
      // console.log(data);
    },
  },
};
</script>
