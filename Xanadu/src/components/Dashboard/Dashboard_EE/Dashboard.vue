<template>
  <div>
    <Toast></Toast>
    <div class="dashboardElements">
      <Graphs
        :salesData="salesData"
        :highestEarningCategories="highestEarningCategories"
        :key="refreshComp"
      />
    </div>
    <div>
      <BestAndWorstSellers :bestAndWorstSellersInfo="bestAndWorstSellersInfo" />
    </div>
  </div>
</template>

<script>
import BestAndWorstSellers from "./dashboard_components/BestAndWorstSellers.vue";
import Graphs from "./dashboard_components/Graphs.vue";
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, getDocs, collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const db = getFirestore(firebaseApp);

export default {
  components: {
    BestAndWorstSellers,
    Graphs,
  },
  data() {
    return {
      userId: "",
      refreshComp: 0,
      chartOptions: null,
      sales: {},
      productCategories: [],
      productCategorySpending: [],
      salesData: null,
      highestEarningCategories: [],
      bestAndWorstSellersInfo: {},
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
      this.sales = await this.getSalesData();
      this.bestAndWorstSellersInfo = await this.getBestAndWorstSellersInfo();
      console.log(this.bestAndWorstSellersInfo);
    },
    sales(sales) {
      console.log(sales);
      var sortedSales = Object.entries(sales);
      sortedSales.sort((a, b) => b[1] - a[1]);
      // console.log(sortedSales);
      this.highestEarningCategories = sortedSales.slice(0, 3);
      // console.log(this.highestEarningCategories);

      this.productCategories = Object.keys(sales);
      // console.log(this.productCategories);
      this.productCategorySpending = Object.values(sales);
      console.log(this.productCategorySpending);
      this.salesData = {
        labels: this.productCategories,
        datasets: [
          {
            data: this.productCategorySpending,
            backgroundColor: ["#738678", "#E4D5A3", "#5F192C", "#C86368"],
            hoverBackgroundColor: ["#838678", "#E4D5C3", "#6F192C", "#E86368"],
          },
        ],
      };
    },
  },

  methods: {
    async refresh() {
      console.log("refreshed!");
      this.refreshComp += 1;
    },

    async getBestAndWorstSellersInfo() {
      var quantityOfProductsSold = {};
      var detailsOfProductsSold = {};
      const db = getFirestore();
      const usersRef = collection(db, "Eco-Entrepreneur");
      const customerRef = doc(usersRef, this.userId);
      const pastOrdersRef = collection(customerRef, "Orders");

      const querySnapshot = await getDocs(pastOrdersRef);

      querySnapshot.forEach((productDoc) => {
        const data = productDoc.data();
        // console.log(data);
        const productName = data.productName;
        var productPrice = data.productPrice.toString();
        const productQuantity = data.productQuantity;
        const productCategory = data.productCategory;
        var categories = "";
        for (const cat of productCategory) {
          categories = categories + cat + ", ";
        }
        categories = categories.slice(0, -2);
        console.log(categories);
        productPrice = "$" + productPrice;
        if (quantityOfProductsSold.hasOwnProperty(productName)) {
          quantityOfProductsSold[productName] += productQuantity;
        } else {
          quantityOfProductsSold[productName] = productQuantity;
        }
        if (detailsOfProductsSold.hasOwnProperty(productName)) {
          // detailOfProductsSold[productName] += productQuantity;
        } else {
          detailsOfProductsSold[productName] = {
            productName: productName,
            productPrice: productPrice,
            productQuantity: productQuantity,
            productCategory: categories,
          };
        }
      });
      // console.log(quantityOfProductsSold);
      // console.log(detailsOfProductsSold);

      quantityOfProductsSold = Object.entries(quantityOfProductsSold);
      quantityOfProductsSold.sort((a, b) => b[1] - a[1]);
      // console.log(quantityOfProductsSold);
      var bestAndWorstSellers = quantityOfProductsSold.map(
        (subArray) => subArray[0]
      );
      // var worstSellers = bestSellers.slice(-5);
      // bestSellers = bestSellers.slice(0, 5);
      var bestAndWorstSellersInfo = {
        bestAndWorstSellersInfo: bestAndWorstSellers,
        // worstSellers: worstSellers,
        details: detailsOfProductsSold,
      };
      // console.log(bestAndWorstSellers);

      return bestAndWorstSellersInfo;
    },

    async getSalesData() {
      var sales = {};
      const db = getFirestore();
      const usersRef = collection(db, "Eco-Entrepreneur");
      const customerRef = doc(usersRef, this.userId);
      const pastOrdersRef = collection(customerRef, "Orders");

      const querySnapshot = await getDocs(pastOrdersRef);

      querySnapshot.forEach((productDoc) => {
        const data = productDoc.data();
        // console.log(data);
        const productCategory = data.productCategory;
        const productPrice = data.productPrice;
        const productQuantity = data.productQuantity;
        const amountEarned = productPrice * productQuantity;
        for (const cat of productCategory) {
          if (sales.hasOwnProperty(cat)) {
            sales[cat] += amountEarned;
          } else {
            sales[cat] = amountEarned;
          }
        }
      });
      return sales;
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
