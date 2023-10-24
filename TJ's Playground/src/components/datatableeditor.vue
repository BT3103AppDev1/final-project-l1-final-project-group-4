<template>
  <div class="card p-fluid">
    <DataTable
      v-model:editingRows="editingRows"
      :value="products"
      editMode="row"
      dataKey="id"
      @row-edit-save="onRowEditSave"
      tableClass="editable-cells-table"
      tableStyle="min-width: 50rem"
    >
      <!-- <Column field="code" header="Code" style="width: 20%">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column> -->
      <Column field="name" header="Name" style="width: 20%">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>
      <Column field="inventoryStatus" header="Status" style="width: 20%">
        <template #editor="{ data, field }">
          <Dropdown
            v-model="data[field]"
            :options="statuses"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a Status"
          >
            <template #option="slotProps">
              <Tag :value="slotProps.option.value" />
            </template>
          </Dropdown>
        </template>
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.inventoryStatus"
            :severity="getStatusLabel(slotProps.data.inventoryStatus)"
          />
        </template>
      </Column>

      <!-- <Column field="price" header="Price" style="width: 20%">
        <template #body="{ data, field }">
          {{ formatCurrency(data[field]) }}
        </template>
        <template #editor="{ data, field }">
          <InputNumber
            v-model="data[field]"
            mode="currency"
            currency="USD"
            locale="en-US"
          />
        </template>
      </Column> -->
      <Column
        :rowEditor="true"
        style="width: 10%; min-width: 8rem"
        bodyStyle="text-align:center"
      ></Column>
    </DataTable>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [
        {
          name: "Bamboo Watch",
          inventoryStatus: "INSTOCK",
          id: "1000",
          // code: "f230fh0g3",
          // description: "Product Description",
          // image: "bamboo-watch.jpg",
          // price: 65,
          // category: "Accessories",
          // quantity: 24,
          // rating: 5,
        },
        {
          name: "Bamboo",
          inventoryStatus: "OUTOFSTOCK",
          id: "2000",
          // code: "f230f",
          // description: "Product",
          // image: "bamboo-watch",
          // price: 60,
          // category: "Accessories",
          // quantity: 2,
          // rating: 7,
        },
        {
          name: "Bah",
          inventoryStatus: "LOWSTOCK",
          id: "3000",
          // code: "f2",
          // description: "Description",
          // image: "bamboo-watch.jpg",
          // price: 5,
          // category: "Access",
          // quantity: 94,
          // rating: 1,
        },
      ],
      editingRows: [],
      statuses: [
        { label: "Water Conservation", value: "Water Conservation" },
        { label: "Energy Conservation", value: "Energy Conservation" },
        { label: "Waste Reduction", value: "Waste Reduction" },
      ],
      // products: [
      //   {
      //     activityDescription: "water",
      //     activityType: "Water Conservation",
      //     amount: "20",
      //   },
      //   {
      //     activityDescription: "energy",
      //     activityType: "energy Conservation",
      //     amount: "10",
      //   },
      //   {
      //     activityDescription: "water1",
      //     activityType: "Water Conservation",
      //     amount: "7",
      //   },
      //   {
      //     activityDescription: "waste",
      //     activityType: "Waste Reduction",
      //     amount: "5",
      //   },
      // ],
    };
  },
  methods: {
    onRowEditSave(event) {
      let { newData, index } = event;

      this.products[index] = newData;
    },
    getStatusLabel(status) {
      switch (status) {
        case "INSTOCK":
          return "success";

        case "LOWSTOCK":
          return "warning";

        case "OUTOFSTOCK":
          return "danger";

        default:
          return null;
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep(.editable-cells-table td.p-cell-editing) {
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
}
</style>
