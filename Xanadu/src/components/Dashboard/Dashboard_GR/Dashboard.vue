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
    <h1 class="ecoFriendlyActivityHeader">Eco-Friendly Activities</h1>
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
import Graphs from "./dashboard_components/Graphs.vue";
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, getDocs, collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const db = getFirestore(firebaseApp);

export default {
  components: {
    EcoFriendlyActivities,
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
      threadsStarted: 0,
      noOfComments: 0,
      highestSpendingProductCategory: "",
    };
  },
  async mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userId = auth.currentUser.uid;
      }
    });
  },
  watch: {
    async userId(userId) {
      this.activityChartData = await this.getActivityChartData(this.userId);
      this.activityData = await this.getActivityData(this.userId);
      this.purchases = await this.getPurchasesData();
      const forum = await this.getThreadsData();
      this.threadsStarted = forum[0];
      this.noOfComments = forum[1];
    },
    purchases(purchases) {
      this.productCategories = Object.keys(purchases);
      this.productCategorySpending = Object.values(purchases);
      this.purchasesData = {
        labels: this.productCategories,
        datasets: [
          {
            data: this.productCategorySpending,
            backgroundColor: ["#738678", "#E4D5A3", "#E6E6E6", "#C86368"],
            hoverBackgroundColor: ["#838678", "#E4D5C3", "#E0E0D0", "#E86368"],
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
    },
  },

  methods: {
    async refresh() {
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
      });
      return activities;
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

      var chartData = {};
      var labels = Object.keys(activityChartData);
      var data = Object.values(activityChartData);
      var colors = ["#738678", "#C86368", "#E4D5A3"];
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
          const amountSpent = productPrice * productQuantity;
          for (const cat of productCategory) {
            if (purchases.hasOwnProperty(cat)) {
              purchases[cat] += amountSpent;
            } else {
              purchases[cat] = amountSpent;
            }
          }
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
  width: 100vw;
  height: 60vh;
  flex-shrink: 0;
  padding: 0vh 2vw 0vh 2vw;
}

.ecoFriendlyActivityHeader {
  margin-left: 2rem;
  color: var(--neutral-gray-404040, #404040);
  font-size: 2rem;
  font-style: normal;
  font-weight: 700;
  line-height: 0.75rem;
  letter-spacing: 0.1rem;
}
</style>
