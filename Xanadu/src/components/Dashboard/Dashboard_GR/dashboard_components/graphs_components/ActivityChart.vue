<template>
  <div class="card">
    <Chart
      type="bar"
      :data="activityChartData"
      :options="chartOptions"
      class="columnChart"
    />
  </div>
</template>

<script>
export default {
  name: "activityChart",
  data() {
    return {
      chartOptions: null,
    };
  },
  props: {
    activityChartData: Object,
  },
  watch: {
    activityChartData(activityChartData) {
      console.log(activityChartData); // --> this is ok
      const documentStyle = getComputedStyle(document.documentElement);
      this.chartOptions = this.setChartOptions();
    },
  },

  methods: {
    setChartOptions() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--text-color");
      const textColorSecondary = "#404040";
      const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

      return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 500,
              },
            },
            grid: {
              display: false,
              drawBorder: false,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 1000,
              },
            },
            grid: {
              display: false,
              drawBorder: false,
            },
            title: {
              display: true,
              text: "Sustainability Points",
            },
          },
        },
      };
    },
  },
};
</script>

<style scoped>
.columnChart {
  width: 100%;
  height: 20rem;
}
</style>
