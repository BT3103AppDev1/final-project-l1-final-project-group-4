<template>
  <div>
    <h1>Graphs</h1>
    <ActivityChart :activityChartData="activityChartData" />
  </div>
</template>

<script>
import ActivityChart from "./graphs_components/ActivityChart.vue";

export default {
  components: {
    ActivityChart,
  },
  props: {
    activityChartData: Object,
  },
  watch: {
    activityChartData(data) {
      console.log(
        "activityChartData has been passed from Dashboard.vue to Graphs.vue. This is activityChartData:"
      );
      console.log(data);
    },
  },
};
</script>
