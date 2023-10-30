<template>
  <div class="card flex justify-content-center">
    <Chart
      type="pie"
      :data="purchasesData"
      :options="chartOptions"
      style="width: 30%; height: 30%"
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
        plugins: {
          legend: {
            labels: {
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
