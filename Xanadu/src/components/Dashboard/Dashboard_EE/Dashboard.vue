<template>
  <div>
    <div class="dashboardElements">
      <Graphs
        :salesData="salesData"
        :highestEarningCategories="highestEarningCategories"
        :key="refreshComp"
      />
    </div>
    <h1 class="tableHeader">Past Order Details</h1>
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
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userId = auth.currentUser.uid;
      }
    });
  },
  watch: {
    async userId(userId) {
      this.sales = await this.getSalesData();
      this.bestAndWorstSellersInfo = await this.getSalesDetails();
    },
    sales(sales) {
      var sortedSales = Object.entries(sales);
      sortedSales.sort((a, b) => b[1] - a[1]);
      sortedSales = sortedSales.slice(0, 3);
      sortedSales = sortedSales.map(function (item) {
        var obj = {};
        obj["category"] = item[0];
        obj["amountEarned"] = "$" + item[1].toFixed(2).toString();
        return obj;
      });
      this.highestEarningCategories = sortedSales;
      // console.log(sortedSales);
      this.productCategories = Object.keys(sales);
      this.productCategorySpending = Object.values(sales);
      this.salesData = {
        labels: this.productCategories,
        datasets: [
          {
            data: this.productCategorySpending,
            backgroundColor: ["#738678", "#E4D5A3", "#E6E6E6", "#C86368"],
            hoverBackgroundColor: ["#838678", "#E4D5C3", "#E0E0D0", "#E86368"],
          },
        ],
      };
    },
  },

  methods: {
    async refresh() {
      this.refreshComp += 1;
    },
    async getSalesDetails() {
      var quantityOfProductsSold = {};
      var detailsOfProductsSold = {};
      const db = getFirestore();
      const usersRef = collection(db, "Eco-Entrepreneur");
      const customerRef = doc(usersRef, this.userId);
      const pastOrdersRef = collection(customerRef, "Fulfilled Orders");

      const querySnapshot = await getDocs(pastOrdersRef);

      querySnapshot.forEach((productDoc) => {
        const data = productDoc.data();
        // console.log(productDoc.data());
        const productName = data.product;
        var productPrice = data.price.toString();
        const productQuantity = data.quantity;
        const productCategory = data.categories;
        var categories = "";
        for (const cat of productCategory) {
          categories = categories + cat + ", ";
        }
        categories = categories.slice(0, -2);
        productPrice = "$" + productPrice;
        // if (quantityOfProductsSold.hasOwnProperty(productName)) {
        //   quantityOfProductsSold[productName] += productQuantity;
        // } else {
        //   quantityOfProductsSold[productName] = productQuantity;
        // }
        if (detailsOfProductsSold.hasOwnProperty(productName)) {
          detailsOfProductsSold[productName].productQuantity += productQuantity;
        } else {
          detailsOfProductsSold[productName] = {
            productName: productName,
            productPrice: productPrice,
            productQuantity: productQuantity,
            productCategory: categories,
          };
        }
      });
      // const details = Object.values(detailsOfProductsSold);
      // quantityOfProductsSold = Object.entries(quantityOfProductsSold);
      // quantityOfProductsSold.sort((a, b) => b[1] - a[1]);
      // var bestAndWorstSellers = quantityOfProductsSold.map(
      //   (subArray) => subArray[0]
      // );
      // var bestAndWorstSellersInfo = {
      //   bestAndWorstSellersInfo: bestAndWorstSellers,
      //   details: detailsOfProductsSold,
      // };
      var bestAndWorstSellersInfo = detailsOfProductsSold;
      // console.log(bestAndWorstSellersInfo);
      return bestAndWorstSellersInfo;
    },

    async getSalesData() {
      var sales = {};
      const db = getFirestore();
      const usersRef = collection(db, "Eco-Entrepreneur");
      const customerRef = doc(usersRef, this.userId);
      const pastOrdersRef = collection(customerRef, "Fulfilled Orders");

      const querySnapshot = await getDocs(pastOrdersRef);

      querySnapshot.forEach((productDoc) => {
        // console.log(productDoc.data());
        const data = productDoc.data();
        const productCategory = data.categories;
        const productPrice = data.price;
        const productQuantity = data.quantity;
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
  width: 100vw;
  height: 67vh;
  flex-shrink: 0;
  margin-bottom: 5vh;
  padding: 0vh 2vw 0vh 2vw;
}

.tableHeader {
  margin-left: 2rem;
  text-align: center;
  color: var(--neutral-gray-404040, #404040);
  font-size: 2rem;
  font-style: normal;
  font-weight: 700;
  line-height: 0.75rem;
  letter-spacing: 0.1rem;
}
</style>
