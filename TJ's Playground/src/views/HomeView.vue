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
    <div class="card flex justify-content-center">
      <Chart
        type="pie"
        :data="purchasesData"
        :options="chartOptions"
        style="width: 30%; height: 30%"
      />
    </div>
    <div class="card flex justify-content-center">
      <ProgressBar />
    </div>
  </main>
</template>

<script>
import TheWelcome from "../components/TheWelcome.vue";
import DataTable from "../components/DataTable.vue";
import ProgressBar from "../components/ProgressBar.vue";
// import DataTable2 from "../components/DataTable2.vue";
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
    ProgressBar,
    // DataTable2,
    TheWelcome,
  },
  compatConfig: { MODE: 3 },

  data() {
    return {
      activityChartData: null,
      activityData: null,
      refreshComp: 0,
      chartData: null,
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
          "Green Rangers/yElxtPHYsvV8hrUsiaJNuvg16Jf1/Eco-Friendly Activities"
        )
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
        collection(
          db,
          "Green Rangers/yElxtPHYsvV8hrUsiaJNuvg16Jf1/Eco-Friendly Activities"
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
      const customerRef = doc(usersRef, "yElxtPHYsvV8hrUsiaJNuvg16Jf1");
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
    // setChartData() {
    //   // const documentStyle = getComputedStyle(document.body);
    //   // return {
    //   //   labels: this.productCategories,
    //   //   datasets: [
    //   //     {
    //   //       data: this.productCategorySpending,
    //   //       backgroundColor: ["#738678", "#E4D5A3", "#5F192C"],
    //   //       hoverBackgroundColor: ["#838678", "#E4D5C3", "#6F192C"],
    //   //     },
    //   //   ],
    //   // };
    // },
    setChartOptions() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--text-color");

      return {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor,
            },
          },
        },
      };
    },
  },
  watch: {
    purchases(purchases) {
      console.log(purchases);
      this.productCategories = Object.keys(purchases);
      // console.log(this.productCategories);
      this.productCategorySpending = Object.values(purchases);
      // console.log(this.productCategorySpending);
      const documentStyle = getComputedStyle(document.body);
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
  async mounted() {
    this.activityChartData = await this.getActivityChartData();
    // console.log(this.activityChartData);
    // let activityData =
    this.activityData = await this.getActivityData();
    this.purchases = await this.getPurchasesData();
    // For debugging
    // this.activityData.forEach((doc) => {
    //   console.log(doc);
    // });
    console.log(this.activityData);
    console.log(
      "activityData and activityChartData has loaded in Dashboard.vue."
    );
    // this.chartData = this.setChartData();
    this.chartOptions = this.setChartOptions();
  },
};
</script>
