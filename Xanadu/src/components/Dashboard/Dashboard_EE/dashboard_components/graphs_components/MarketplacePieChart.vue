<template>
  <div>
    <Chart
      type="pie"
      :data="salesData"
      :options="chartOptions"
      style="width: 80%; height: 100%"
    />
  </div>
</template>

<script>
export default {
  name: "marketplacePieChart",
  props: {
    salesData: Object,
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
                size: 25,
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
