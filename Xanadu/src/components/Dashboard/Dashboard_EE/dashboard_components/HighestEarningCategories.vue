<template>
  <div>
    <DataTable :value="highestEarningCategories">
      <Column
        field="category"
        header="Category Name"
        style="
          width: 50%;
          text-align: center;
          height: 6.5rem;
          font-size: 1.5rem;
        "
        headerClass="column-text-right"
      ></Column>
      <Column
        field="amountEarned"
        header="Amount Earned"
        style="
          width: 50%;
          text-align: center;
          height: 6.5rem;
          font-size: 1.5rem;
        "
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
  watch: {
    highestEarningCategories(data) {
      console.log(data);
      // this.productInfo = Object.values(data["details"]);
      // console.log(this.productInfo);
    },
  },
};
</script>

<style scoped>
.eeDashboardTable {
  width: 97%;
  height: 100%;
  flex-shrink: 0;
  margin-left: 2rem;
  margin-right: 3rem;
  padding: 0rem 0rem 0rem 0rem;
  margin-bottom: 3rem;
  border: 0.15rem solid #738678;
  border-radius: 0.1rem;
}
</style>

<style lang="scss">
.column-text-right {
  .p-column-header-content {
    text-align: center; // or center
    display: block !important;
    // color: white;
    // background: #404e3e;
    // margin: 0px;
  }
  // .p-sortable-column {
  //   text-align: center; // or center
  //   display: block !important;
  //   color: white;
  //   background: #404e3e;
  //   // margin: 0px;
  // }
}
</style>
