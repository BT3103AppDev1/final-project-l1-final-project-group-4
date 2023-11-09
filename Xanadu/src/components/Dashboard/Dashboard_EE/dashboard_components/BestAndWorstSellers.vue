<template>
  <div>
    <DataTable
      :value="productInfo"
      sortField="productQuantity"
      :sortOrder="-1"
      removableSort
      tableStyle="min-width: 50rem"
    >
      <Column
        field="productCategory"
        header="Categories"
        sortable
        style="width: 25%"
      ></Column>
      <Column
        field="productName"
        header="Name"
        sortable
        style="width: 25%"
      ></Column>
      <Column
        field="productPrice"
        header="Price"
        sortable
        style="width: 25%"
      ></Column>
      <Column
        field="productQuantity"
        header="Quantity Sold"
        sortable
        style="width: 25%"
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
