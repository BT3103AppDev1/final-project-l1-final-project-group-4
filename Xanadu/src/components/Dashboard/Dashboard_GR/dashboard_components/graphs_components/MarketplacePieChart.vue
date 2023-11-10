<template>
  <div>
    <h4 class="graphTitle">Money Spent by Product Category</h4>
    <Chart
      type="pie"
      :data="purchasesData"
      :options="chartOptions"
      style="width: 95%; height: 100%"
    />
  </div>
</template>

<script>
export default {
  name: "marketplacePieChart",
  props: {
    purchasesData: Object,
  },
  data() {
    return {
      chartOptions: null,
    };
  },
  methods: {
    setChartOptions() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--text-color");

      return {
        aspectRatio: 1.4,
        plugins: {
          legend: {
            responsive: true,
            boxHeight: 500,
            position: "right",

            // title: {
            //   display: true,
            //   text: "Product Categories",
            //   color: textColor,
            //   font: {
            //     size: 20,
            //   },
            // },
            labels: {
              // display: true,
              font: {
                size: 16,
              },
              usePointStyle: true,
              color: textColor,
            },
          },
        },
      };
    },
  },

  async mounted() {
    this.chartOptions = this.setChartOptions();
  },
};
</script>

<style scoped>
.graphTitle {
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: 0.5rem; /* 39.063% */
  letter-spacing: 0.05rem;
  color: var(--neutral-gray-404040, #404040);
}
</style>
