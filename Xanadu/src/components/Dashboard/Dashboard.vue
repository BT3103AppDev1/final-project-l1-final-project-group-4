<template>
  <div>
    <Toast></Toast>
    <Graphs
      :activityChartData="activityChartData"
      :purchasesData="purchasesData"
      :key="refreshComp"
    />
    <MilestoneProgress />
    <EcoFriendlyActivities
      :activityData="activityData"
      @added="refresh"
      @deletedActivity="refresh"
      @activityEdited="refresh"
      :key="refreshComp"
    />
  </div>
</template>

<script>
import EcoFriendlyActivities from "./dashboard_components/EcoFriendlyActivities.vue";
import MilestoneProgress from "./dashboard_components/MilestoneProgress.vue";
import Graphs from "./dashboard_components/Graphs.vue";
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, getDocs, collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const db = getFirestore(firebaseApp);

export default {
  components: {
    EcoFriendlyActivities,
    MilestoneProgress,
    Graphs,
  },
  async mounted() {
    const auth = getAuth();
    // console.log(auth.currentUser.uid);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userId = auth.currentUser.uid;
      }
    });
  },
  watch: {
    async userId(userId) {
      console.log(this.userId);
      this.activityChartData = await this.getActivityChartData(this.userId);
      // console.log(this.activityChartData);
      // let activityData =
      this.activityData = await this.getActivityData(this.userId);

      // For debugging
      // this.activityData.forEach((doc) => {
      //   console.log(doc);
      // });
      // console.log(this.activityData);
      console.log(
        "activityData and activityChartData has loaded in Dashboard.vue."
      );
      this.purchases = await this.getPurchasesData();
    },
    purchases(purchases) {
      console.log(purchases);
      this.productCategories = Object.keys(purchases);
      // console.log(this.productCategories);
      this.productCategorySpending = Object.values(purchases);
      // console.log(this.productCategorySpending);
      this.purchasesData = {
        labels: this.productCategories,
        datasets: [
          {
            data: this.productCategorySpending,
            backgroundColor: ["#738678", "#E4D5A3", "#5F192C"],
            hoverBackgroundColor: ["#838678", "#E4D5C3", "#6F192C"],
          },
        ],
      };
    },
  },
  data() {
    return {
      userId: "",
      activityChartData: null,
      activityData: null,
      refreshComp: 0,
      chartOptions: null,
      purchases: {},
      productCategories: [],
      productCategorySpending: [],
      purchasesData: null,
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
        collection(
          db,
          "Green Rangers/" + this.userId + "/Eco-Friendly Activities"
        )
      );
      var activities = [];
      allDocuments.forEach((docs) => {
        var activity = docs.data();
        activity.id = docs.id;
        activities.push(activity);
        // console.log(docs.data());
        //console.log(activity);
      });
      return activities;
      // console.log(activities);
    },
    async getActivityChartData() {
      let allDocuments = await getDocs(
        collection(
          db,
          "Green Rangers/" + this.userId + "/Eco-Friendly Activities"
        )
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

    async getPurchasesData() {
      var purchases = {};
      const db = getFirestore();
      const usersRef = collection(db, "Green Rangers");
      const customerRef = doc(usersRef, this.userId);
      const pastOrdersRef = collection(customerRef, "Past Orders");

      const querySnapshot = await getDocs(pastOrdersRef);

      const promises = querySnapshot.docs.map(async (orderDoc) => {
        const productsRef = collection(orderDoc.ref, "products");
        const productQuerySnapshot = await getDocs(productsRef);

        productQuerySnapshot.forEach((productDoc) => {
          const data = productDoc.data();
          const category = data.category;
          const cost = data.cost;
          const quantity = data.quantity;

          if (purchases.hasOwnProperty(category)) {
            purchases[category] += cost * quantity;
          } else {
            purchases[category] = cost * quantity;
          }
          // console.log(purchases);
        });
      });

      await Promise.all(promises);

      return purchases;
    },
  },
};
</script>
