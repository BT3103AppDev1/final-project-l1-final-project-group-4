<template>
  <div>
    <div>
      <h1 class="dashboardHeader">Dashboard</h1>

      <div class="pieChart">
        <MarketplacePieChart :salesData="salesData" />
      </div>
      <h4 class="graphTitle">Top 3 Profitable Product Categories</h4>
      <div class="eeDashboardTable">
        <HighestEarningCategories
          :highestEarningCategories="highestEarningCategories"
        />
      </div>
    </div>
  </div>
</template>

<script>
import HighestEarningCategories from "./HighestEarningCategories.vue";
import MarketplacePieChart from "./graphs_components/MarketplacePieChart.vue";

export default {
  components: {
    MarketplacePieChart,
    HighestEarningCategories,
  },
  props: {
    salesData: Object,
    highestEarningCategories: Array,
  },
  watch: {
    salesData(data) {
      // console.log(data);
    },
    highestEarningCategories(data) {
      // console.log(data);
    },
  },
};
</script>

<style scoped>
.pieChart {
  width: 40%;
  height: 100%;
  flex-shrink: 0;
  float: left;
}

.eeDashboardTable {
  width: 45%;
  height: 100%;
  flex-shrink: 0;
  float: right;
  margin-left: 0rem;
  margin-right: 1rem;
  padding: 0rem 0rem 0rem 0rem;
  margin-bottom: 3rem;
  border: 0.15rem solid #738678;
  border-radius: 0.1rem;
}

.dashboardHeader {
  margin-top: 2.5rem;
  font-size: 3rem;
  font-style: normal;
  font-weight: 700;
  line-height: 0.75rem; /* 39.063% */
  letter-spacing: 0.1rem;
  color: var(--neutral-gray-404040, #404040);
}

.graphTitle {
  margin-top: 2.5rem;
  margin-left: 63rem;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: 0.5rem; /* 39.063% */
  letter-spacing: 0.05rem;
  color: var(--neutral-gray-404040, #404040);
}
</style>
