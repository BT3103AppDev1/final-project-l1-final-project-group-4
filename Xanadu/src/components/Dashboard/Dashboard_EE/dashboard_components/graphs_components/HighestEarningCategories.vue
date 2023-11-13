<template>
  <div>
    <h4 class="graphTitle">Top 3 Profitable Product Categories</h4>
    <DataTable :value="highestEarningCategories" class="eeDashboardTable">
      <Column
        field="category"
        header="Category Name"
        style="width: 50%; text-align: center; height: 12.5vh; font-size: 1.5vw"
        headerClass="column-text-right"
      ></Column>
      <Column
        field="amountEarned"
        header="Amount Earned"
        style="width: 50%; text-align: center; height: 12.5vh; font-size: 1.5vw"
        headerClass="column-text-right"
      ></Column>
    </DataTable>
  </div>
</template>

<script>
export default {
  props: {
    highestEarningCategories: Array,
  },
};
</script>

<style scoped>
.eeDashboardTable {
  width: 55vw;
  float: right;
  flex-shrink: 0;
  margin-right: 1.1vw;

  border: 0.15vw solid #738678;
  border-radius: 0.1vw;
}

.graphTitle {
  text-align: center;
  margin-top: 6.2vh;
  font-size: 1.3vw;
  font-style: normal;
  font-weight: 700;
  line-height: 0.5vh;
  letter-spacing: 0.05vw;
  color: var(--neutral-gray-404040, #404040);
}
</style>

<style lang="scss">
.column-text-right {
  .p-column-header-content {
    text-align: center;
    display: block !important;
  }
}
</style>
