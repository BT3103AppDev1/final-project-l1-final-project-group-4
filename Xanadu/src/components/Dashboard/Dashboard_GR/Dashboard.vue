<template>
  <div>
    <Toast></Toast>
    <div class="dashboardElements">
      <Graphs
        :activityChartData="activityChartData"
        :purchasesData="purchasesData"
        :threadsStarted="threadsStarted"
        :noOfComments="noOfComments"
        :highestSpendingProductCategory="highestSpendingProductCategory"
        :key="refreshComp"
      />
    </div>

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
      totalSpending: 0, // this would be used for progress bar
      threadsStarted: 0,
      noOfComments: 0,
      highestSpendingProductCategory: "",
    };
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
      // console.log(this.userId);
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
      const forum = await this.getThreadsData();
      this.threadsStarted = forum[0];
      this.noOfComments = forum[1];
      // console.log(forum);
    },
    purchases(purchases) {
      // console.log(purchases);
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
      var i = 0;
      var index = 0;
      var highestSpending = 0;

      while (i < this.productCategorySpending.length) {
        const spending = this.productCategorySpending[i];
        this.totalSpending += spending;
        if (spending > highestSpending) {
          index = i;
          highestSpending = spending;
        }
        i++;
      }
      this.highestSpendingProductCategory = this.productCategories[index];
      // console.log(this.highestSpendingProductCategory);
    },
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

      console.log(activityChartData);
      // console.log(activityChartData);
      var chartData = {};
      var labels = Object.keys(activityChartData);
      var data = Object.values(activityChartData);
      var colors = ["#738678", "#C86368", "#E4D5A3"];
      // // console.log(data); // --> this is ok
      var datasets = [
        {
          backgroundColor: colors,
          data: data,
        },
      ];

      chartData = {
        labels: labels,
        datasets: datasets,
      };
      console.log(chartData);

      return chartData;
    },

    async getPurchasesData() {
      var purchases = {};
      const db = getFirestore();
      const usersRef = collection(db, "Green Rangers");
      const customerRef = doc(usersRef, this.userId);
      const pastOrdersRef = collection(customerRef, "Orders");

      const querySnapshot = await getDocs(pastOrdersRef);

      const promises = querySnapshot.docs.map(async (orderDoc) => {
        const productsRef = collection(orderDoc.ref, "Products");
        const productQuerySnapshot = await getDocs(productsRef);

        productQuerySnapshot.forEach((productDoc) => {
          const data = productDoc.data();
          const productCategory = data.productCategory;
          const productPrice = data.productPrice;
          const productQuantity = data.productQuantity;

          if (purchases.hasOwnProperty(productCategory)) {
            purchases[productCategory] += productPrice * productQuantity;
          } else {
            purchases[productCategory] = productPrice * productQuantity;
          }
          // console.log(purchases);
        });
      });

      await Promise.all(promises);

      return purchases;
    },
    async getThreadsData() {
      var threads = {};
      const db = getFirestore();
      const usersRef = collection(db, "Green Rangers");
      const customerRef = doc(usersRef, this.userId);
      const pastOrdersRef = collection(customerRef, "threads");

      const querySnapshot = await getDocs(pastOrdersRef);
      var threadsStarted = 0;
      var noOfComments = 0;
      const promises = querySnapshot.docs.map(async (orderDoc) => {
        threadsStarted += 1;
        const repliesRef = collection(orderDoc.ref, "replies");
        const replyQuerySnapshot = await getDocs(repliesRef);

        replyQuerySnapshot.forEach((reply) => {
          noOfComments += 1;
        });
      });

      await Promise.all(promises);

      return [threadsStarted, noOfComments];
    },
  },
};
</script>

<style scoped>
.dashboardElements {
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  margin-bottom: 30rem;
}
</style>
