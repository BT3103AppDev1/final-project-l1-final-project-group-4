<template>
  <div>
    <DataTable
      :value="productInfo"
      sortField="productQuantity"
      :sortOrder="-1"
      removableSort
      tableStyle="min-width: 50rem"
      class="eeDashboardTable"
    >
      <Column
        field="productCategory"
        header="Categories"
        sortable
        style="width: 25%; text-align: center; font-size: 1.25rem"
        headerClass="column-text-right"
      ></Column>
      <Column
        field="productName"
        header="Name"
        sortable
        style="width: 25%; text-align: center; font-size: 1.25rem"
        headerClass="column-text-right"
      ></Column>
      <Column
        field="productPrice"
        header="Price"
        sortable
        style="width: 25%; text-align: center; font-size: 1.25rem"
        headerClass="column-text-right"
      ></Column>
      <Column
        field="productQuantity"
        header="Quantity Sold"
        sortable
        style="width: 25%; text-align: center; font-size: 1.25rem"
        headerClass="column-text-right"
      ></Column>
    </DataTable>
  </div>
</template>

<script>
export default {
  data() {
    return {
      productInfo: null,
    };
  },
  props: {
    bestAndWorstSellersInfo: Object,
  },
  watch: {
    bestAndWorstSellersInfo(data) {
      console.log(data);
      this.productInfo = Object.values(data["details"]);
      // console.log(this.productInfo);
    },
  },
  // methods: {
  //   rowStyle(data) {
  //     if (data.productQuantity === 2) {
  //       return {
  //         // fontWeight: "bold",
  //         // fontStyle: "italic",
  //         backgroundColor: "#738678",
  //       };
  //     }
  //   },
  // },
};
</script>

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

<style scoped>
.eeDashboardTable {
  width: 95vw;
  flex-shrink: 0;
  margin-left: 2vw;
  margin-bottom: 5vh;
  border: 0.15vw solid #738678;
  border-radius: 0.1vw;
}
</style>
