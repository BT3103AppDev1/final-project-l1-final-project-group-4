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
  watch: {
    purchasesData(data) {
      console.log(data);
    },
  },
  methods: {
    setChartOptions() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--text-color");

      return {
        aspectRatio: 1.4,
        animation: {
          onProgress: function () {
            const ctx = this.ctx;

            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";

            let dataSum = 0;
            if (
              this._sortedMetasets.length > 0 &&
              this._sortedMetasets[0].data.length > 0
            ) {
              const dataset = this._sortedMetasets[0].data[0].$context.dataset;
              dataSum = dataset.data.reduce((p, c) => p + c, 0);
            }
            if (dataSum <= 0) return;

            this._sortedMetasets.forEach((meta) => {
              meta.data.forEach((metaData) => {
                const dataset = metaData.$context.dataset;
                const datasetIndex = metaData.$context.dataIndex;
                const value = dataset.data[datasetIndex];
                const percent =
                  "$" +
                  value +
                  " (" +
                  Math.round((value / dataSum) * 1000) / 10 +
                  "%" +
                  ")";
                const mid_radius =
                  metaData.innerRadius +
                  (metaData.outerRadius - metaData.innerRadius) * 0.7;
                const start_angle = metaData.startAngle;
                const end_angle = metaData.endAngle;
                if (start_angle === end_angle) return; // hidden
                const mid_angle = start_angle + (end_angle - start_angle) / 2;

                const x = mid_radius * Math.cos(mid_angle);
                const y = mid_radius * Math.sin(mid_angle);

                ctx.fillStyle = "black";
                ctx.fillText(percent, metaData.x + x, metaData.y + y + 15);
              });
            });
          },
        },
        plugins: {
          legend: {
            responsive: true,
            boxHeight: 500,
            position: "right",
            labels: {
              display: true,
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
  font-size: 1.3vw;
  font-style: normal;
  font-weight: 700;
  line-height: 0.5vh; /* 39.063% */
  letter-spacing: 0.05vw;
  color: var(--neutral-gray-404040, #404040);
}
</style>
