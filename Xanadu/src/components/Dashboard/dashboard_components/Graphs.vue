<template>
  <div>
    <div>
      <h1>Dashboard</h1>
      <div style="display: inline-block; width: 35%">
        <h4>Money Spent by Product Category</h4>
        <MarketplacePieChartVue :purchasesData="purchasesData" />
      </div>
      <div style="width: 30%; display: inline-block">
        <TopSpendingProductCategoryCard
          :highestSpendingProductCategory="highestSpendingProductCategory"
        />
        <ForumThreadsStartedCard :threadsStarted="threadsStarted" />

        <NoOfCommentsCard :noOfComments="noOfComments" />
      </div>
      <h4>Eco-Friendly Activities Points</h4>
      <ActivityChart :activityChartData="activityChartData" />
    </div>
  </div>
</template>

<script>
import MarketplacePieChartVue from "./graphs_components/MarketplacePieChart.vue";
import TopSpendingProductCategoryCard from "./graphs_components/TopSpendingProductCategoryCard.vue";
import ForumThreadsStartedCard from "./graphs_components/ForumThreadsStartedCard.vue";
import NoOfCommentsCard from "./graphs_components/ForumCommentsCard.vue";
import ActivityChart from "./graphs_components/ActivityChart.vue";

export default {
  components: {
    ActivityChart,
    MarketplacePieChartVue,
    TopSpendingProductCategoryCard,
    ForumThreadsStartedCard,
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
