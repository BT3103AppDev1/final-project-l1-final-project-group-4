<template>
  <div>
    <Toast> </Toast>
    <div class="card">
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
        removableSort
        class="ecoFriendlyActivitiesTable"
      >
        <Toolbar class="mb-4">
          <template #start>
            <span class="p-input-icon-left" style="margin-right: 10px">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Search..."
              />
            </span>
            <Button
              label="Add Activity"
              icon="pi pi-plus"
              severity="success"
              class="mr-2"
              @click="openNew"
              style="
                margin-right: 10px;
                background-color: #738678;
                border-color: white;
              "
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

        <Column
          selectionMode="multiple"
          style="width: 3rem"
          :exportable="false"
        ></Column>
        <Column
          field="name"
          header="Name"
          sortable
          style="min-width: 12rem; text-align: center"
          headerClass="column-text-right"
        >
        </Column>
        <Column
          field="activityDescription"
          header="Activity Description"
          sortable
          style="min-width: 12rem; text-align: center"
          headerClass="column-text-right"
        ></Column>
        <Column
          field="sustainabilityPoints"
          header="Points"
          sortable
          style="min-width: 8rem; text-align: center"
          headerClass="column-text-right"
        ></Column>
        <Column
          field="amount"
          header="Amount"
          sortable
          style="min-width: 8rem; text-align: center"
          headerClass="column-text-right"
        >
          <template #body="slotProps">
            {{ formatAmount(slotProps.data) }}
          </template>
        </Column>
        <Column
          field="activityType"
          header="ActivityType"
          sortable
          style="min-width: 10rem; text-align: center"
          headerClass="column-text-right"
        ></Column>
        <Column
          field="date"
          header="Date"
          style="min-width: 10rem; text-align: center"
          sortable
          headerClass="column-text-right"
        >
        </Column>

        <Column :exportable="false" style="text-align: center; width: 10%">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              outlined
              class="mr-2"
              @click="editActivity(slotProps.data)"
              style="
                width: 3.5rem;
                height: 3.5rem;
                background-color: #404e3e;
                color: white;
              "
            />
            <Button
              icon="pi pi-times"
              outlined
              severity="danger"
              @click="confirmDeleteActivity(slotProps.data)"
              style="
                width: 3.5rem;
                height: 3.5rem;
                background-color: #404e3e;
                color: white;
              "
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
      :pt="{
        mask: {
          style: 'backdrop-filter: blur(2px); background-color: black',
        },
      }"
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
              v-model="activityType"
              style="margin-right: 0.2rem"
            />
            <label for="activityType1">Water Conservation</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="activityType2"
              name="activityType"
              value="Energy Conservation"
              v-model="activityType"
              style="margin-right: 0.2rem"
            />
            <label for="activityType2">Energy Conservation</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="activityType3"
              name="activityType"
              value="Waste Reduction"
              v-model="activityType"
              style="margin-right: 0.2rem"
            />
            <label for="activityType3">Waste Reduction</label>
          </div>
        </div>
      </div>

      <div class="formgrid grid">
        <div class="field col">
          <label for="amount">Amount</label>
          <br />
          <InputNumber
            id="amount"
            v-model="activity.amount"
            :minFractionDigits="0"
            :maxFractionDigits="2"
            style="width: 85%"
          />
          <h4
            v-show="activityTypeWaterConservation"
            style="display: inline; color: black"
          >
            &nbsp; L
          </h4>
          <h4
            v-show="activityTypeWasteReduction"
            style="display: inline; color: black"
          >
            &nbsp; Kg
          </h4>
          <h4
            v-show="activityTypeEnergyConservation"
            style="display: inline; color: black"
          >
            &nbsp; KwH
          </h4>
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
          @click="hideDialog"
          style="background-color: #5a6d57; color: white"
        />
        <Button
          label="Add"
          icon="pi pi-check"
          text
          @click="addActivity"
          style="background-color: #5a6d57; color: white"
        />
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
              v-model="activityType"
              style="margin-right: 0.2rem"
            />
            <label for="activityType1">Water Conservation</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="activityType2"
              name="activityType"
              value="Energy Conservation"
              v-model="activityType"
              style="margin-right: 0.2rem"
            />
            <label for="activityType2">Energy Conservation</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="activityType3"
              name="activityType"
              value="Waste Reduction"
              v-model="activityType"
              style="margin-right: 0.2rem"
            />
            <label for="activityType3">Waste Reduction</label>
          </div>
        </div>
      </div>

      <div class="formgrid grid">
        <div class="field col">
          <label for="amount">Amount</label>
          <br />
          <InputNumber
            id="amount"
            v-model="activity.amount"
            :minFractionDigits="0"
            :maxFractionDigits="2"
            style="width: 85%"
          />
          <h4
            v-show="activityTypeWaterConservation"
            style="display: inline; color: black"
          >
            &nbsp; L
          </h4>
          <h4
            v-show="activityTypeWasteReduction"
            style="display: inline; color: black"
          >
            &nbsp; Kg
          </h4>
          <h4
            v-show="activityTypeEnergyConservation"
            style="display: inline; color: black"
          >
            &nbsp; KwH
          </h4>
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
          style="background-color: #5a6d57; color: white"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          text
          @click="updateActivity"
          style="background-color: #5a6d57; color: white"
        />
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
          class="pi pi-exclamation-triangle"
          style="font-size: 2rem; margin: 10px"
        />
        <span v-if="activity"
          >Delete <b>{{ activity.name }}</b
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
        <i
          class="pi pi-exclamation-triangle"
          style="font-size: 2rem; margin: 10px"
        />
        <span v-if="activity">Delete the selected activities?</span>
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
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
      userId: "",
      activityType: "",
      activityTypeWaterConservation: false,
      activityTypeEnergyConservation: false,
      activityTypeWasteReduction: false,
    };
  },
  props: {
    activityData: Array,
  },
  watch: {
    activityType(type) {
      this.activity.activityType = type;
      if (type == "Water Conservation") {
        this.activityTypeWaterConservation = true;
        this.activityTypeEnergyConservation = false;
        this.activityTypeWasteReduction = false;
      }
      if (type == "Energy Conservation") {
        this.activityTypeWaterConservation = false;
        this.activityTypeEnergyConservation = true;
        this.activityTypeWasteReduction = false;
      }
      if (type == "Waste Reduction") {
        this.activityTypeWaterConservation = false;
        this.activityTypeEnergyConservation = false;
        this.activityTypeWasteReduction = true;
      }
    },
    activityDialog(value) {
      if (value == false) {
        this.activityTypeWaterConservation = false;
        this.activityTypeEnergyConservation = false;
        this.activityTypeWasteReduction = false;
        this.activityType = "";
      }
    },
    editActivityDialog(value) {
      if (value == false) {
        this.activityTypeWaterConservation = false;
        this.activityTypeEnergyConservation = false;
        this.activityTypeWasteReduction = false;
        this.activityType = "";
      }
    },
  },
  created() {
    this.initFilters();
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.userId = auth.currentUser.uid;
    });
  },
  methods: {
    formatAmount(data) {
      if (data.activityType == "Waste Reduction") {
        return String(data.amount) + " Kg";
      }
      if (data.activityType == "Water Conservation") {
        return String(data.amount) + " L";
      }
      if (data.activityType == "Energy Conservation") {
        return String(data.amount) + " KwH";
      }
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
      if (
        this.activity.name == null ||
        this.activity.activityType == null ||
        this.activity.activityDescription == null ||
        this.activity.amount == null ||
        this.activity.date == null
      ) {
        this.$toast.add({
          severity: "info",
          summary: "Please fill in all fields!",
          life: 3000,
        });
      } else {
        this.$toast.add({
          severity: "info",
          summary: "Adding Activity...",
          life: 3000,
        });
        var date = this.activity.date;
        const dateObject = new Date(date);
        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, "0");
        const day = String(dateObject.getDate()).padStart(2, "0");
        date = `${day}/${month}/${year}`;
        let sustainabilityPoints = (this.activity.amount / 10).toFixed(3);

        try {
          const docRef = await addDoc(
            collection(
              db,
              "Green Rangers/" + this.userId + "/Eco-Friendly Activities"
            ),
            {
              name: this.activity.name,
              activityType: this.activity.activityType,
              activityDescription: this.activity.activityDescription,
              amount: this.activity.amount,
              sustainabilityPoints: sustainabilityPoints,
              date: date,
            }
          );
        } catch (error) {
          console.error("Error adding document: ", error);
        }
        this.$emit("added");
        this.$toast.add({
          severity: "success",
          summary: "Activity Added!",
          life: 3000,
        });
        this.submitted = true;
        this.activityDialog = false;
        this.activity = {};
      }
    },
    editActivity(activity) {
      this.activityType = activity.activityType;
      this.activity = { ...activity };
      this.editActivityDialog = true;
    },
    async updateActivity() {
      if (
        this.activity.name == "" ||
        this.activity.activityType == null ||
        this.activity.activityDescription == "" ||
        this.activity.amount == null ||
        this.activity.date == null
      ) {
        this.$toast.add({
          severity: "info",
          summary: "Please fill in all fields!",
          life: 3000,
        });
      } else {
        this.$toast.add({
          severity: "info",
          summary: "Updating Activity...",
          life: 3000,
        });
        var data = this.activity;
        const activityDoc = await doc(
          db,
          "Green Rangers/" + this.userId + "/Eco-Friendly Activities/" + data.id
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
          life: 3000,
        });

        this.submitted = true;
        this.editActivityDialog = false;
        this.activity = {};
      }
    },

    confirmDeleteActivity(activity) {
      this.activity = activity;
      this.deleteActivityDialog = true;
    },
    async deleteActivity() {
      this.$toast.add({
        severity: "error",
        summary: "Deleting Activity...",
        life: 3000,
      });
      await deleteDoc(
        doc(
          db,
          "Green Rangers/" +
            this.userId +
            "/Eco-Friendly Activities/" +
            this.activity.id
        )
      );
      this.deleteActivityDialog = false;
      this.activity = {};
      this.$toast.add({
        severity: "success",
        summary: "Activity Deleted!",
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
        life: 3000,
      });
      this.selectedActivities.forEach(async (activity) => {
        await deleteDoc(
          doc(
            db,
            "Green Rangers/" +
              this.userId +
              "/Eco-Friendly Activities/" +
              activity.id
          )
        );
      });

      this.deleteActivitiesDialog = false;
      this.selectedActivities = null;
      this.$toast.add({
        severity: "success",
        summary: "Activities Deleted!",
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

<style scoped>
.ecoFriendlyActivityHeader {
  color: var(--neutral-gray-404040, #404040);
  font-size: 2rem;
  font-style: normal;
  font-weight: 700;
  line-height: 0.75rem;
  letter-spacing: 0.1rem;
}

.ecoFriendlyActivitiesTable {
  width: 95vw;
  flex-shrink: 0;
  margin-left: 2vw;
  margin-bottom: 5vh;
  border: 0.15vw solid #738678;
  border-radius: 0.1vw;
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
