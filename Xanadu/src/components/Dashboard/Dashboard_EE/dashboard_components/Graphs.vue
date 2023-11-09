<template>
  <div>
    <div>
      <h1>Dashboard</h1>

      <div class="pieChart">
        <h4>Money Spent by Product Category</h4>
        <MarketplacePieChart :salesData="salesData" />
      </div>
      <div class="cards">
        <HighestEarningCategoryCard :category="highestEarningCategories[0]" />
        <SecondHighestEarningCategoryCard
          :category="highestEarningCategories[1]"
        />
        <ThirdHighestEarningCategoryCard
          :category="highestEarningCategories[2]"
        />
      </div>
    </div>
  </div>
</template>

<script>
import HighestEarningCategoryCard from "./graphs_components/HighestEarningCategoryCard.vue";
import MarketplacePieChart from "./graphs_components/MarketplacePieChart.vue";
import ThirdHighestEarningCategoryCard from "./graphs_components/ThirdHighestEarningCategoryCard.vue";
import SecondHighestEarningCategoryCard from "./graphs_components/SecondHighestEarningCategoryCard.vue";

export default {
  components: {
    MarketplacePieChart,
    HighestEarningCategoryCard,
    SecondHighestEarningCategoryCard,
    ThirdHighestEarningCategoryCard,
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
  width: 50%;
  height: 100%;
  flex-shrink: 0;
  float: left;
}

.cards {
  margin-top: 4rem;
  width: 40%;
  height: 100%;
  flex-shrink: 0;
  float: right;
  margin-right: 2%;
}
</style>
