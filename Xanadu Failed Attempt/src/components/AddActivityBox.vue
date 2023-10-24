<template>
  <div class="container">
    <form id="addEcoFriendlyActivity">
      <h2 style="color: black">Add Activity</h2>
      <div class="formli" id="addActivity">
        <!-- <label for="activityType">Activity Type:</label> -->
        <div id="addingActivityType">
          <select v-model="activityType" id="activityType">
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
        <div id="addingActivityDescription">
          <label for="activityDescription">Activity Description:</label>
          <br />
          <textarea
            v-model.lazy="activityDescription"
            id="activityDescription"
            placeholder="Activity Description"
          ></textarea>
        </div>
        <div id="addingActivityAmount">
          <input
            type="text"
            v-model.number.lazy="amount"
            placeholder="Amount"
            style="display: inline-flex"
            id="acitivityAmount"
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
        </div>
        <br />
        <button id="addActivityButton" type="submit" @click.prevent="savetofs">
          Add
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      activityTypes: [
        "Water Conservation",
        "Energy Conservation",
        "Waste Reduction",
      ],
      activityType: "",
      activityDescription: "",
      amount: "",
      // activityDate: "",

      activityTypeEnergyConservation: false,
      activityTypeWaterConservation: false,
      activityTypeWasteReduction: false,
    };
  },
  watch: {
    activityType(type) {
      if (type == "Water Conservation") {
        this.activityTypeWaterConservation = true;
        this.activityTypeEnergyConservation = false;
        this.activityTypeWasteReduction = false;
      } else if (type == "Energy Conservation") {
        this.activityTypeWaterConservation = false;
        this.activityTypeEnergyConservation = true;
        this.activityTypeWasteReduction = false;
      } else if (type == "Waste Reduction") {
        this.activityTypeWaterConservation = false;
        this.activityTypeEnergyConservation = false;
        this.activityTypeWasteReduction = true;
      }
    },
  },
  methods: {
    async savetofs() {
      // bear in mind that you have to check whether the Amount field is really a number. But let's worry about that later on
      // Also keep the description to less than 50 words
      // also make sure need check if any fields are empty, dont add.
      console.log("Saving to Firestore...");

      let activityType = this.activityType;
      let activityDescription = this.activityDescription;
      let amount = this.amount;
      // add in the convertion to sustainability points here.

      console.log(activityType);
      console.log(activityDescription);
      console.log(amount);
      let sustainabilityPoints = (amount / 10).toFixed(3);

      alert("Saving you Eco Friendly Activity Data!");
      try {
        const docRef = await addDoc(
          collection(
            db,
            "Users/Green Rangers/TestingAcct/Eco-Friendly Activities/" +
              activityType
          ),
          {
            activityType: activityType,
            activityDescription: activityDescription,
            amount: amount,
            sustainabilityPoints: sustainabilityPoints,
            date: "Not yet done",
          }
        );
        console.log("Document written with ID: ", docRef.id);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
      this.activityType = "";
      this.activityDescription = "";
      this.amount = "";
      document.getElementById("addEcoFriendlyActivity").reset();
      this.$emit("added");
      console.log("Done!");
    },
  },
};
</script>

<style>
.container {
  color: darkgrey;
}
button {
  background-color: #738678;
  color: white;
  font-weight: bold;
  /* width: 100%; */
}
</style>
