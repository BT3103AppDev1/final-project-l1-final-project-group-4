<template>
  <div>
    <Toast> </Toast>
    <div class="card">
      <Toolbar class="mb-4">
        <template #start>
          <Button
            label="Add Eco-Friendly Activity"
            icon="pi pi-plus"
            severity="success"
            class="mr-2"
            @click="openNew"
            style="margin-right: 10px"
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            @click="confirmDeleteSelected"
            :disabled="!selectedActivities || !selectedActivities.length"
          />
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :value="activityData"
        v-model:selection="selectedActivities"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      >
        <template #header>
          <div
            class="flex flex-wrap gap-2 align-items-center justify-content-between"
          >
            <h4 class="m-0">Manage Activities</h4>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Search..."
              />
            </span>
          </div>
        </template>

        <Column
          selectionMode="multiple"
          style="width: 3rem"
          :exportable="false"
        ></Column>
        <Column
          field="name"
          header="Name"
          sortable
          style="min-width: 12rem"
        ></Column>
        <Column
          field="activityDescription"
          header="Activity Description"
          sortable
          style="min-width: 12rem"
        ></Column>
        <Column
          field="sustainabilityPoints"
          header="Points"
          sortable
          style="min-width: 16rem"
        ></Column>
        <Column field="amount" header="Amount" sortable style="min-width: 8rem">
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.amount) }}
          </template>
        </Column>
        <Column
          field="activityType"
          header="ActivityType"
          sortable
          style="min-width: 10rem"
        ></Column>
        <Column field="date" header="Date" style="min-width: 10rem" sortable>
        </Column>

        <Column :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              class="mr-2"
              @click="editActivity(slotProps.data)"
              style="margin: 5px"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDeleteActivity(slotProps.data)"
              style="margin: 5px"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="activityDialog"
      :style="{ width: '450px' }"
      header="Activity Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="name">Name</label>
        <InputText
          id="name"
          v-model.trim="activity.name"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !activity.name }"
        />
        <small class="p-error" v-if="submitted && !activity.name"
          >Name is required.</small
        >
      </div>
      <div class="field">
        <label for="activityDescription">Description</label>
        <Textarea
          id="activityDescription"
          v-model="activity.activityDescription"
          required="true"
          rows="3"
          cols="20"
        />
      </div>
      <div class="field">
        <label class="mb-3">Activity Type</label>
        <div class="formgrid grid">
          <div class="field-radiobutton col-6">
            <RadioButton
              id="activityType1"
              name="activityType"
              value="Water Conservation"
              v-model="activity.activityType"
            />
            <label for="activityType1">Water Conservation</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="activityType2"
              name="activityType"
              value="Energy Conservation"
              v-model="activity.activityType"
            />
            <label for="activityType2">Energy Conservation</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="activityType3"
              name="activityType"
              value="Waste Reduction"
              v-model="activity.activityType"
            />
            <label for="activityType3">Waste Reduction</label>
          </div>
        </div>
      </div>

      <div class="formgrid grid">
        <div class="field col">
          <label for="amount">Amount</label>
          <InputNumber
            id="amount"
            v-model="activity.amount"
            :minFractionDigits="0"
            :maxFractionDigits="2"
          />
        </div>
        <div class="field col">
          <label for="Date Picker">Date</label>
          <Calendar
            v-model="activity.date"
            id="datePicker"
            showIcon
            dateFormat="dd/mm/yy"
          />
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Add" icon="pi pi-check" text @click="addActivity" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="editActivityDialog"
      :style="{ width: '450px' }"
      header="Activity Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="name">Name</label>
        <InputText
          id="name"
          v-model.trim="activity.name"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !activity.name }"
        />
        <small class="p-error" v-if="submitted && !activity.name"
          >Name is required.</small
        >
      </div>
      <div class="field">
        <label for="activityDescription">Description</label>
        <Textarea
          id="activityDescription"
          v-model="activity.activityDescription"
          required="true"
          rows="3"
          cols="20"
        />
      </div>
      <div class="field">
        <label class="mb-3">Activity Type</label>
        <div class="formgrid grid">
          <div class="field-radiobutton col-6">
            <RadioButton
              id="activityType1"
              name="activityType"
              value="Water Conservation"
              v-model="activity.activityType"
            />
            <label for="activityType1">Water Conservation</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="activityType2"
              name="activityType"
              value="Energy Conservation"
              v-model="activity.activityType"
            />
            <label for="activityType2">Energy Conservation</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="activityType3"
              name="activityType"
              value="Waste Reduction"
              v-model="activity.activityType"
            />
            <label for="activityType3">Waste Reduction</label>
          </div>
        </div>
      </div>

      <div class="formgrid grid">
        <div class="field col">
          <label for="amount">Amount</label>
          <InputNumber
            id="amount"
            v-model="activity.amount"
            :minFractionDigits="0"
            :maxFractionDigits="2"
          />
        </div>
        <div class="field col">
          <label for="Date Picker">Date</label>
          <Calendar
            v-model="activity.date"
            id="datePicker"
            showIcon
            dateFormat="dd/mm/yy"
          />
        </div>
      </div>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          text
          @click="hideEditDialog"
        />
        <Button label="Save" icon="pi pi-check" text @click="updateActivity" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteActivityDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i
          class="pi pi-exclamation-triangle mr-3"
          style="font-size: 2rem; margin: 10px"
        />
        <span v-if="activity"
          >Are you sure you want to delete <b>{{ activity.name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          text
          @click="deleteActivityDialog = false"
        />
        <Button label="Yes" icon="pi pi-check" text @click="deleteActivity" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteActivitiesDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="activity"
          >Are you sure you want to delete the selected activities?</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          text
          @click="deleteActivitiesDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          text
          @click="deleteSelectedActivities"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { FilterMatchMode } from "primevue/api";
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  collection,
} from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      activityDialog: false,
      deleteActivityDialog: false,
      editActivityDialog: false,
      deleteActivitiesDialog: false,
      activity: {},
      selectedActivities: null,
      filters: {},
      submitted: false,
    };
  },
  props: {
    activityData: Array,
  },
  watch: {
    activityData(data) {
      console.log(data);
    },
  },
  created() {
    this.initFilters();
  },
  mounted() {
    // console.log(this.activityData);
    // ProductService.getProducts().then((data) => (this.products = data));
  },
  methods: {
    formatCurrency(value) {
      if (value)
        return value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      return;
    },
    openNew() {
      this.activity = {};
      this.submitted = false;
      this.activityDialog = true;
    },
    hideDialog() {
      this.activityDialog = false;
      this.submitted = false;
    },
    hideEditDialog() {
      this.editActivityDialog = false;
      this.submitted = false;
    },
    async addActivity() {
      this.$toast.add({
        severity: "info",
        summary: "Adding Activity...",
        // detail: "Activity Deleted",
        life: 3000,
      });
      console.log(this.activity);
      var date = this.activity.date;
      const dateObject = new Date(date);
      const year = dateObject.getFullYear();
      const month = String(dateObject.getMonth() + 1).padStart(2, "0");
      const day = String(dateObject.getDate()).padStart(2, "0");
      date = `${day}/${month}/${year}`;
      let sustainabilityPoints = (this.activity.amount / 10).toFixed(3);
      try {
        const docRef = await addDoc(
          collection(db, "Green Rangers/TestingAcct/Eco-Friendly Activities"),
          {
            name: this.activity.name,
            activityType: this.activity.activityType,
            activityDescription: this.activity.activityDescription,
            amount: this.activity.amount,
            sustainabilityPoints: sustainabilityPoints,
            date: date,
          }
        );
        console.log(
          "Eco-friendly activity Document added with ID: ",
          docRef.id
        );
      } catch (error) {
        console.error("Error adding document: ", error);
      }
      this.$emit("added");
      this.$toast.add({
        severity: "success",
        summary: "Activity Added!",
        // detail: "Activity Deleted",
        life: 3000,
      });
      console.log("Input box resetted, 'added' was emitted");

      this.submitted = true; // dont touch
      this.activityDialog = false; // dont touch
      this.activity = {};
    },
    editActivity(activity) {
      this.activity = { ...activity };
      this.editActivityDialog = true;
    },
    async updateActivity() {
      //   console.log(this.activity);
      this.$toast.add({
        severity: "info",
        summary: "Updating Activity...",
        // detail: "Activity Deleted",
        life: 3000,
      });
      var data = this.activity;
      const activityDoc = await doc(
        db,
        "Green Rangers/TestingAcct/Eco-Friendly Activities/" + data.id
      );
      var date = data.date;
      if (typeof data.date === "string") {
      } else {
        const dateObject = new Date(date);
        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, "0");
        const day = String(dateObject.getDate()).padStart(2, "0");
        date = `${day}/${month}/${year}`;
      }
      var points = (data.amount / 10).toFixed(3);
      await updateDoc(activityDoc, {
        name: data.name,
        activityDescription: data.activityDescription,
        activityType: data.activityType,
        amount: data.amount,
        sustainabilityPoints: points,
        date: date,
      });
      this.$emit("activityEdited");
      this.$toast.add({
        severity: "success",
        summary: "Activity Updated!",
        // detail: "Activity Deleted",
        life: 3000,
      });
      console.log("activityEdited");

      this.submitted = true; // dont touch
      this.editActivityDialog = false; // dont touch
      this.activity = {};
    },

    confirmDeleteActivity(activity) {
      this.activity = activity;
      this.deleteActivityDialog = true;
    },
    async deleteActivity() {
      this.$toast.add({
        severity: "error",
        summary: "Deleting Activity...",
        // detail: "Activity Deleted",
        life: 3000,
      });
      await deleteDoc(
        doc(
          db,
          "Green Rangers/TestingAcct/Eco-Friendly Activities/" +
            this.activity.id
        )
      );
      this.deleteActivityDialog = false;
      this.activity = {};
      this.$toast.add({
        severity: "success",
        summary: "Activity Deleted!",
        // detail: "Activity Deleted",
        life: 3000,
      });
      this.$emit("deletedActivity");
    },

    confirmDeleteSelected() {
      this.deleteActivitiesDialog = true;
    },
    async deleteSelectedActivities() {
      this.$toast.add({
        severity: "error",
        summary: "Deleting Activities...",
        // detail: "Activity Deleted",
        life: 3000,
      });
      this.selectedActivities.forEach(async (activity) => {
        await deleteDoc(
          doc(
            db,
            "Green Rangers/TestingAcct/Eco-Friendly Activities/" + activity.id
          )
        );
      });

      this.deleteActivitiesDialog = false;
      this.selectedActivities = null;
      this.$toast.add({
        severity: "success",
        summary: "Activities Deleted!",
        // detail: "Activity Deleted",
        life: 3000,
      });
      this.$emit("deletedActivity");
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
    },
  },
};
</script>
