<template>
  <div>
    <h1>Dashboard</h1>
    <div>
      <h4>Money Spent by Product Category</h4>
      <MarketplacePieChartVue :purchasesData="purchasesData" />
    </div>
    <HighestSpendingProductCategoryCard
      :highestSpendingProductCategory="highestSpendingProductCategory"
    />
    <ThreadsStartedCard :threadsStarted="threadsStarted" />
    <NoOfCommentsCard :noOfComments="noOfComments" />
    <ActivityChart :activityChartData="activityChartData" />
  </div>
</template>

<script>
import MarketplacePieChartVue from "./graphs_components/MarketplacePieChart.vue";
import HighestSpendingProductCategoryCard from "./graphs_components/HighestSpendingProductCategoryCard.vue";
import ThreadsStartedCard from "./graphs_components/ThreadsStartedCard.vue";
import NoOfCommentsCard from "./graphs_components/NoOfCommentsCard.vue";
import ActivityChart from "./graphs_components/ActivityChart.vue";

export default {
  components: {
    ActivityChart,
    MarketplacePieChartVue,
    HighestSpendingProductCategoryCard,
    ThreadsStartedCard,
    NoOfCommentsCard,
  },
  props: {
    activityChartData: Object,
    purchasesData: Object,
    threadsStarted: Number,
    noOfComments: Number,
    highestSpendingProductCategory: String,
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
