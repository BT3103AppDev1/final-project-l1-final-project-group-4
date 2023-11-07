<template>
  <div>
    <div><h4>Eco-Friendly Activity Bargraph</h4></div>
    <div>
      <column-chart id="activityChart" :data="activityChartData" />
    </div>
  </div>
</template>

<script>
export default {
  name: "activityChart",
  props: {
    activityChartData: Object,
  },
};
</script>

<style scoped>
.activityChart {
  background-color: #738678;
}
</style>
