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
      this.productInfo = Object.values(data);
    },
  },
};
</script>

<style lang="scss">
.column-text-right {
  .p-column-header-content {
    text-align: center;
    display: block !important;
  }
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
