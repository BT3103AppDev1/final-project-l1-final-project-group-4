<template>
  <div>
    <div>
      <h1 class="ecoFriendlyActivityHeader">Dashboard</h1>

      <div class="pieChart">
        <MarketplacePieChartVue :purchasesData="purchasesData" />
      </div>
      <div class="cards">
        <TopSpendingProductCategoryCard
          :highestSpendingProductCategory="highestSpendingProductCategory"
        />
        <ForumThreadsStartedCard :threadsStarted="threadsStarted" />
        <NoOfCommentsCard :noOfComments="noOfComments" />
      </div>
      <div class="activityChart">
        <h4 class="graphTitle">Eco-Friendly Activities Points</h4>
        <ActivityChart :activityChartData="activityChartData" />
      </div>
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
      // console.log(data);
    },
    purchasesData(data) {
      // console.log(data);
    },
  },
};
</script>

<style scoped>
.pieChart {
  width: 35%;
  height: 13.5vh;
  flex-shrink: 0;
  float: left;
}

.cards {
  margin-top: 2%;
  width: 30%;
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

.ecoFriendlyActivityHeader {
  margin-top: 2.5vw;
  font-size: 3vw;
  font-style: normal;
  font-weight: 700;
  line-height: 0.75vw; /* 39.063% */
  letter-spacing: 0.1vw;
  color: var(--neutral-gray-404040, #404040);
}

.graphTitle {
  font-size: 1.3vw;
  font-style: normal;
  font-weight: 700;
  line-height: 0.5vh; /* 39.063% */
  letter-spacing: 0.05vw;
  color: var(--neutral-gray-404040, #404040);
}
</style>
