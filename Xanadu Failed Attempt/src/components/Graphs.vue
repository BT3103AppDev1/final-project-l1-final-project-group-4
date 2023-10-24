<template>
  <div>
    <ActivityChart :activityData="activityData" />
  </div>
</template>

<script>
import ActivityChart from "./ActivityChart.vue";
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, getDocs, collection } from "firebase/firestore";
const db = getFirestore(firebaseApp);
export default {
  components: {
    ActivityChart,
  },
  data() {
    return {
      activityData: null,
    };
  },
  async mounted() {
    async function getActivityChartData(category) {
      const subcollectionRefs = [
        collection(
          db,
          "Users/Green Rangers/TestingAcct/Eco-Friendly Activities/" + category
        ),
      ];
      const promises = subcollectionRefs.map((ref) => getDocs(ref));
      var points = 0;
      try {
        const allSnapshots = await Promise.all(promises);
        allSnapshots.forEach((snapshot) => {
          snapshot.forEach((doc) => {
            let document = doc.data();
            points += Number(document.sustainabilityPoints);
          });
        });
        console.log("Points for " + category + ": ", points);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
      return points;
    }
    var ad = {
      "Water Conservation": 0,
      "Energy Conservation": 0,
      "Waste Reduction": 0,
    };
    for (const category of [
      "Water Conservation",
      "Energy Conservation",
      "Waste Reduction",
    ]) {
      let points = await getActivityChartData(category);
      console.log(points);
      ad[category] = points;
    }
    this.activityData = ad;
    console.log("activityData is:");
    console.log(this.activityData);
  },
};
</script>
