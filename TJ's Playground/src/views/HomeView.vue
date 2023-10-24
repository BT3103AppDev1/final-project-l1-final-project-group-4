<template>
  <main>
    <Toast></Toast>
    <DataTable
      :activityData="activityData"
      @added="refresh"
      @deletedActivity="refresh"
      @activityEdited="refresh"
      :key="refreshComp"
    />
    <!-- <DataTable2 :products="activityData" /> -->
    <!-- <TheWelcome /> -->
    <!-- <AddActivityBox />
    <AddActivity /> -->
    <!-- <EcoFriendlyActivities /> -->
  </main>
</template>

<script>
import TheWelcome from "../components/TheWelcome.vue";
import DataTable from "../components/DataTable.vue";
import DataTable2 from "../components/DataTable2.vue";
// import AddActivityBox from "../components/AddActivityBox.vue";
// import AddActivity from "../components/AddActivity.vue";
// import EcoFriendlyActivities from "../components/EcoFriendlyActivities.vue";
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, getDocs, collection } from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {
  components: {
    DataTable,
    DataTable2,
    TheWelcome,
  },

  data() {
    return {
      activityChartData: null,
      activityData: null,
      refreshComp: 0,
    };
  },
  methods: {
    async refresh() {
      console.log("refreshed!");
      this.refreshComp += 1;
      this.activityData = await this.getActivityData();
      this.activityChartData = await this.getActivityChartData();
    },
    async getActivityData() {
      let allDocuments = await getDocs(
        collection(db, "Green Rangers/TestingAcct/Eco-Friendly Activities")
      );
      var activities = [];
      allDocuments.forEach((docs) => {
        var activity = docs.data();
        activity.id = docs.id;
        activities.push(activity);
        // console.log(docs.data());
        console.log(activity);
      });
      return activities;
      // console.log(activities);
    },
    async getActivityChartData() {
      let allDocuments = await getDocs(
        collection(db, "Green Rangers/TestingAcct/Eco-Friendly Activities")
      );
      var activityChartData = {};
      allDocuments.forEach((docs) => {
        var activity = docs.data();
        if (!activityChartData.hasOwnProperty(activity.activityType)) {
          activityChartData[activity.activityType] = parseFloat(
            activity.sustainabilityPoints
          );
        } else {
          activityChartData[activity.activityType] += parseFloat(
            activity.sustainabilityPoints
          );
        }
      });
      // console.log(activityChartData);
      return activityChartData;
    },
  },
  async mounted() {
    this.activityChartData = await this.getActivityChartData();
    // console.log(this.activityChartData);
    // let activityData =
    this.activityData = await this.getActivityData();
    // For debugging
    // this.activityData.forEach((doc) => {
    //   console.log(doc);
    // });
    console.log(this.activityData);
    console.log(
      "activityData and activityChartData has loaded in Dashboard.vue."
    );
  },
};
</script>
