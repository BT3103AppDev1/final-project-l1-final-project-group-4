<template>
  <div class="container">
    <button @click="toggleForm">Add Activity</button>

    <div v-if="showForm" class="popup">
      <div class="popup-content">
        <button @click="toggleForm">X</button>
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
                id="activityAmount"
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
            <DatePicker></DatePicker>
            <br />
            <button
              id="addActivityButton"
              type="submit"
              @click.prevent="savetofs"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {
  // components: {
  //   DatePicker,
  // },
  data() {
    return {
      showForm: false,
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
    toggleForm() {
      this.showForm = !this.showForm;
    },
    async savetofs() {
      // bear in mind that you have to check whether the Amount field is really a number. But let's worry about that later on
      // Also keep the description to less than 50 words
      // also make sure need check if any fields are empty, dont add.
      console.log("Adding Eco-friendly Activity to Firestore...");

      let activityType = this.activityType;
      let activityDescription = this.activityDescription;
      let amount = this.amount;
      // add in the convertion to sustainability points here.

      console.log(activityType);
      console.log(activityDescription);
      console.log(amount);
      let sustainabilityPoints = (amount / 10).toFixed(3);

      alert("Saving your Eco-Friendly Activity Data!");
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
        console.log(
          "Eco-friendly activity Document added with ID: ",
          docRef.id
        );
      } catch (error) {
        console.error("Error adding document: ", error);
      }
      this.activityType = "";
      this.activityDescription = "";
      this.amount = "";
      document.getElementById("addEcoFriendlyActivity").reset();
      this.$emit("added");
      console.log("Input box resetted, 'added' was emitted");
    },
  },
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
