<template>
  <div>
    <form id="addEcoFriendlyActivity">
      <div>
        <h1>Add Activity</h1>
      </div>
      <div class="card flex justify-content-center">
        <Dropdown
          id="activityType"
          v-model="activityType"
          :options="activityTypes"
          optionLabel="label"
          optionValue="value"
          placeholder="Activity Type"
          class="w-full md:w-14rem"
        />
      </div>
      <span class="p-float-label">
        <TextArea id="activityDescription" v-model="activityDescription" />
        <label for="activityDescription">Activity Description</label>
      </span>
      <span class="p-float-label">
        <InputNumber
          v-model="amount"
          inputId="amount"
          :minFractionDigits="0"
          :maxFractionDigits="2"
        />
        <label for="amount">Amount</label>
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
      </span>
      <div id="dateSelector">
        <Calendar v-model="date" showIcon dateFormat="dd/mm/yy" />
      </div>
      <Button
        label="AddActivity"
        icon="pi pi-user"
        id="addButtonForForm"
        @click.prevent="savetofs"
        type="submit"
        >Add Activity</Button
      >
    </form>
  </div>
</template>

<script>
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {
  emits: ["info"],
  data() {
    return {
      showForm: false,
      activityDescription: null,
      amount: null,
      activityType: null,
      activityTypes: [
        { label: "Water Conservation", value: "Water Conservation" },
        { label: "Energy Conservation", value: "Energy Conservation" },
        { label: "Waste Reduction", value: "Waste Reduction" },
      ],
      date: null,
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
      // Also keep the description to less than 50 words
      // also make sure need check if any fields are empty, dont add.
      console.log("Adding Eco-friendly Activity to Firestore...");

      let activityType = this.activityType;
      let activityDescription = this.activityDescription;
      let amount = this.amount;
      var date = this.date;
      const dateObject = new Date(date);
      const year = dateObject.getFullYear();
      const month = String(dateObject.getMonth() + 1).padStart(2, "0");
      const day = String(dateObject.getDate()).padStart(2, "0");
      date = `${day}/${month}/${year}`;

      // add in the convertion to sustainability points here.

      console.log(activityType);
      console.log(activityDescription);
      console.log(amount);
      console.log(date);
      let sustainabilityPoints = (amount / 10).toFixed(3);

      alert("Saving your Eco-Friendly Activity Data!");
      try {
        const docRef = await addDoc(
          collection(
            db,
            "Green Rangers/TestingAcct/Eco-Friendly Activities"
            //  + activityType
          ),
          {
            activityType: activityType,
            activityDescription: activityDescription,
            amount: amount,
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
      this.activityType = null;
      this.activityDescription = null;
      this.amount = null;
      this.date = null;
      document.getElementById("addEcoFriendlyActivity").reset();
      this.$emit("added");
      console.log("Input box resetted, 'added' was emitted");
    },
  },
};
</script>
