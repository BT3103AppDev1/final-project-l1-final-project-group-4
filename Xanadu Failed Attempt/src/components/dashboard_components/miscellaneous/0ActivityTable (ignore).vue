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
    </table>
    <br /><br />
    <!-- <button id="buttonToAddActivity">Add Activity</button> -->
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
    activityData: Object,
  },
  data() {
    return {
      activities: null,
    };
  },
  watch: {
    activityData(data) {
      console.log(
        "activityData has been passed from EcoFriendlyActivities.vue to ActivityTable.vue. This is activityData:"
      );
      console.log(data);
      async function display() {
        let allDocuments = data;
        // console.log(data);
        var index = 1;
        allDocuments.forEach((doc) => {
          let activityId = doc.id;
          let activityDescription = doc.activityDescription;
          let activityType = doc.activityType;
          let amount = doc.amount;
          let sustainabilityPoints = doc.sustainabilityPoints;
          let date = doc.date;
          var units = "";
          if (activityType == "Water Conservation") {
            units = "L";
          } else if (activityType == "Energy Conservation") {
            units = "KwH";
          } else if (activityType == "Waste Reduction") {
            units = "Kg";
          }

          let table = document.getElementById("ecoFriendlyActivitiesTable");
          let row = table.insertRow(index);
          row.id = activityId;

          let cell1 = row.insertCell(0);
          let cell2 = row.insertCell(1);
          let cell3 = row.insertCell(2);
          let cell4 = row.insertCell(3);
          let cell5 = row.insertCell(4);
          let cell6 = row.insertCell(5);

          cell1.innerHTML = activityDescription;
          cell2.innerHTML = activityType;
          cell3.innerHTML = amount.toString() + units;
          cell4.innerHTML = sustainabilityPoints;
          cell5.innerHTML = date;
          cell6.innerHTML = "";

          // let updateButton = document.createElement("button");
          // updateButton.id = document.id+"_update";
          // updateButton.className = "bwt";
          // updateButton.innerHTML = "update";
          // cell6.appendChild(updateButton);
          // updateButton.onclick = function () {
          //   editActivity(activityType, activityId);
          // };

          let deleteButton = document.createElement("button");
          deleteButton.id = document.id + "_delete";
          deleteButton.className = "bwt";
          deleteButton.innerHTML = "X";

          cell6.appendChild(deleteButton);
          deleteButton.onclick = () => {
            // deleteActivity(activityType, activityId);
            deleteActivity(activityType, activityId);
            // this.emitDeletedActivity();
            // console.log(this.activityData);
          };
          index += 1;
        });
      }
      display();
      async function deleteActivity(activityType, activityId) {
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

        console.log("Document successfully deleted!");
        let tb = document.getElementById("ecoFriendlyActivitiesTable");
        // while (tb.rows.length > 1) {
        //   tb.deleteRow(1);
        // }
        // tb.deleteRow();
        // display();
        for (let i = 1; i < tb.rows.length; i++) {
          if (tb.rows[i].id === activityId) {
            tb.deleteRow(i);
            break; // No need to continue searching
          }
        }
        // this.$emit("deletedActivity");
        // return true;
      }
    },
  },
  // methods: {
  //   emitDeletedActivity() {
  //     this.$emit("deletedActivity");
  //   },
  // },
};
</script>
