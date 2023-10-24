<template>
  <div>
    <h1>This is the home page</h1>
    <Toast> </Toast>
    <span class="p-float-label">
      <InputText id="activityDescription" v-model="activityDescription" />
      <label for="activityDescription">Activity Description</label>
    </span>
    <span class="p-float-label">
      <InputText id="txt" v-model="text" />
      <label for="txt">Text</label>
    </span>
    <br />
    <Button label="Greet" @click="greet" icon="pi pi-user"> </Button>
    <br />
    <br />
    <Calendar v-model="date" showIcon />
    <br />
    <br />
    <Button label="Show Date" @click="showDate"> </Button>
    <DataTable :value="products" tableStyle="min-width: 50rem">
      <Column field="activityDescription" header="Description"></Column>
      <Column field="activityType" header="Type"></Column>
      <Column field="amount" header="Amount"></Column>
    </DataTable>

    <br /><br />
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
        <Column
          field="activityDescription"
          header="Description"
          style="width: 20%"
        >
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" />
          </template>
        </Column>
        <Column field="activityType" header="Type" style="width: 20%">
          <template #editor="{ data, field }">
            <Dropdown
              v-model="data[field]"
              :options="statuses"
              optionLabel="label"
              optionValue="value"
              placeholder="Select a Status"
            >
              <!-- <template #option="slotProps">
              <Tag :value="slotProps.option.value" />
            </template> -->
            </Dropdown>
          </template>
          <!-- <template #body="slotProps">
          <Tag :value="slotProps.data.activityType" />
        </template> -->
        </Column>
        <Column field="amount" header="Amount" style="width: 20%">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" />
          </template>
        </Column>
        <Column field="date" header="Date" style="width: 20%">
          <template #editor="{ data, field }">
            <Calendar v-model="data[field]" showIcon />
            <!-- <InputText v-model="data[field]" /> -->
          </template>
        </Column>
        <Column
          :rowEditor="true"
          style="width: 10%; min-width: 8rem"
          bodyStyle="text-align:center"
        ></Column>
      </DataTable>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    greet() {
      this.$toast.add({
        severity: "success",
        summary: "PrimeTime",
        detail: this.text,
      });
    },
    showDate() {
      console.log(this.date);
    },
    onRowEditSave(event) {
      let { newData, index } = event;
      this.products[index] = newData;
    },
    // getStatusLabel(status) {
    //         switch (status) {
    //             case 'INSTOCK':
    //                 return 'success';

    //             case 'LOWSTOCK':
    //                 return 'warning';

    //             case 'OUTOFSTOCK':
    //                 return 'danger';

    //             default:
    //                 return null;
    //         }
    //     },
  },

  data() {
    return {
      activityDescription: null,
      text: null,
      date: "",
      editingRows: [],
      statuses: [
        { label: "Water Conservation", value: "Water Conservation" },
        { label: "Energy Conservation", value: "Energy Conservation" },
        { label: "Waste Reduction", value: "Waste Reduction" },
      ],
      // products: [
      //   { code: 1, name: "A", category: "i", quantity: "5" },
      //   { code: 2, name: "B", category: "ii", quantity: "6" },
      //   { code: 3, name: "C", category: "iii", quantity: "7" },
      //   { code: 4, name: "D", category: "iv", quantity: "8" },
      // ],
      products: [
        {
          id: 1,
          activityDescription: "water",
          activityType: "Water Conservation",
          amount: "20",
          date: "10/27/2023",
        },
        {
          id: 2,
          activityDescription: "energy",
          activityType: "energy Conservation",
          amount: "10",
          date: "10/24/2023",
        },
        {
          id: 3,
          activityDescription: "water1",
          activityType: "Water Conservation",
          amount: "7",
          date: "10/28/2023",
        },
        {
          id: 4,
          activityDescription: "waste",
          activityType: "Waste Reduction",
          amount: "5",
          date: "10/31/2023",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep(.editable-cells-table td.p-cell-editing) {
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
}
</style>
