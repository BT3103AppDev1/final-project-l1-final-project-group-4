<template>
  <div>
    <div>
      <h1 class="dashboardHeader">Dashboard</h1>
      <div class="pieChart">
        <MarketplacePieChart :salesData="salesData" />
      </div>
      <div>
        <HighestEarningCategories
          :highestEarningCategories="highestEarningCategories"
        />
      </div>
    </div>
  </div>
</template>

<script>
import HighestEarningCategories from "./graphs_components/HighestEarningCategories.vue";
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
  margin-top: 2.5vw;
  font-size: 3vw;
  font-style: normal;
  font-weight: 700;
  line-height: 0.75vw; /* 39.063% */
  letter-spacing: 0.1vw;
  color: var(--neutral-gray-404040, #404040);
}
</style>
