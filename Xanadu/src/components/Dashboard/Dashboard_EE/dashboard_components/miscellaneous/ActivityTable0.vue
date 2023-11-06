<template>
  <div>
    <h2 style="color: black">Eco-Friendly Activities</h2>
    <table id="ecoFriendlyActivitiesTable" class="auto-index">
      <tr>
        <th>Activity Description</th>
        <th>Activity Type</th>
        <th>Amount</th>
        <th>Sustainability Points</th>
        <th>Date</th>
        <th>Options</th>
      </tr>
      <tr v-for="activity in activityData" :key="activity.id">
        <td>{{ activity.activityDescription }}</td>
        <td>{{ activity.activityType }}</td>
        <td>{{ activity.amount }}{{ getUnits(activity.activityType) }}</td>
        <td>{{ activity.sustainabilityPoints }}</td>
        <td>{{ activity.date }}</td>
        <td>
          <button @click="toggleUpdateForm(activity)">Edit</button>
          <button @click="deleteActivity(activity.activityType, activity.id)">
            X
          </button>
        </td>
      </tr>
    </table>
    <br /><br />
    <!-- <DatePicker></DatePicker> -->
    <!-- <button id="buttonToAddActivity">Add Activity</button> -->
    <div v-if="showUpdateForm" class="popup">
      <div class="popup-content">
        <button @click="toggleUpdateForm(null)">Close Form</button>
        <form id="updateActivityForm">
          <div>
            <label for="activityDescription">Activity Description:</label>
            <br />
            <textarea
              v-model="updateForm.description"
              id="updateActivityDescription"
              placeholder="Update Activity Description"
            ></textarea>
            <br />
          </div>
          <div>
            <select v-model="updateForm.type" id="updateActivityType">
              <!-- <option value="" disabled selected>Activity Type</option> -->
              <option
                v-if="!activityType"
                value=""
                disabled
                selected
                style="display: none"
              >
                Activity Type
              </option>
              <option v-for="activity in activityTypes" :key="activity">
                {{ activity }}
              </option>
            </select>
          </div>
          <br />
          <div>
            <input
              type="text"
              v-model.number.lazy="updateForm.amount"
              placeholder="Amount"
              style="display: inline-flex"
              id="updateActivityAmount"
            />
            <h4
              v-show="activityTypeWasteReduction"
              style="display: inline-flex; color: black"
            >
              &nbsp;Kg
            </h4>
            <h4
              v-show="activityTypeWaterConservation"
              style="display: inline-flex; color: black"
            >
              &nbsp;Litres
            </h4>
            <h4
              v-show="activityTypeEnergyConservation"
              style="display: inline-flex; color: black"
            >
              &nbsp;KwH
            </h4>
            <!-- Add other fields as needed -->
          </div>
          <br />
          <button
            id="updateActivityButton"
            type="submit"
            @submit.prevent="
              updateActivity(
                updateForm.description,
                updateForm.type,
                updateForm.points,
                updateForm.date
              )
            "
          >
            Update
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import {
  doc,
  getDocs,
  setDoc,
  addDoc,
  collection,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default {
  emits: ["deletedActivity"],
  props: {
    activityData: Array,
  },
  data() {
    return {
      updateForm: {
        description: "",
        type: "",
        amount: "",
        // points: "",
        date: "Not Done Yet",
      },
      activityTypes: [
        "Water Conservation",
        "Energy Conservation",
        "Waste Reduction",
      ],
      activityTypeEnergyConservation: false,
      activityTypeWaterConservation: false,
      activityTypeWasteReduction: false,
    };
  },
  methods: {
    toggleUpdateForm(activity) {
      if (activity) {
        this.description = activity.activityDescription;
        this.type = activity.activityType;
        this.amount = activity.amount;
        this.date = activity.date;
      }
      console.log(this.description);
      this.showUpdateForm = !this.showUpdateForm;
    },
    getUnits(activityType) {
      let units = "";
      if (activityType === "Water Conservation") {
        units = "L";
      } else if (activityType === "Energy Conservation") {
        units = "KwH";
      } else if (activityType === "Waste Reduction") {
        units = "Kg";
      }
      return units;
    },
    async updateActivity(description, type, amount, date) {
      alert("Editing activity!");
      var points = amount / 10;
      const doc = doc(
        db,
        "Users/Green Rangers/TestingAcct/Eco-Friendly Activities/" +
          activityType +
          "/" +
          activityId
      );
      await updateDoc(doc, {
        activityDescription: description,
        activityType: type,
        amount: amount,
        sustainabilityPoints: points,
        date: date,
      });
      this.toggleUpdateForm(null);
      this.$emit("deletedActivity");
    },
    async deleteActivity(activityType, activityId) {
      console.log(activityType);
      console.log(activityId);
      alert("Deleting activity!");
      await deleteDoc(
        doc(
          db,
          "Users/Green Rangers/TestingAcct/Eco-Friendly Activities/" +
            activityType +
            "/" +
            activityId
        )
      );
      this.$emit("deletedActivity");
    },
  },
  watch: {
    updateForm(form) {
      if (form.type == "Water Conservation") {
        this.activityTypeWaterConservation = true;
        this.activityTypeEnergyConservation = false;
        this.activityTypeWasteReduction = false;
      } else if (form.type == "Energy Conservation") {
        this.activityTypeWaterConservation = false;
        this.activityTypeEnergyConservation = true;
        this.activityTypeWasteReduction = false;
      } else if (form.type == "Waste Reduction") {
        this.activityTypeWaterConservation = false;
        this.activityTypeEnergyConservation = false;
        this.activityTypeWasteReduction = true;
      }
    },
  },
  // data() {
  //   return {
  //     activities: {},
  //   };
  // },
  // watch: {
  //   activityData(data) {
  //     console.log(
  //       "activityData has been passed from EcoFriendlyActivities.vue to ActivityTable.vue. This is activityData:"
  //     );
  //     console.log(data);
  //   },
  // },
};
</script>

<style scoped>
.container {
  color: darkgrey;
}
button {
  background-color: #738678;
  color: white;
  font-weight: bold;
  /* width: 100%; */
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.popup-content {
  text-align: center;
}
</style>
