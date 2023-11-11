<script>
import Image from "primevue/image";
import Divider from "primevue/divider";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

import firebaseApp from "@/firebase.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const db = getFirestore();

export default {
  data() {
    return {
      user: null,
      userType: null,
      orders: [],
      count: 0,
      selectedProduct: [],
    };
  },

  watch: {
    selectedProduct(newlyfulfilledproducts, oldfulfilledproducts) {
      oldfulfilledproducts.filter((product) => {
        !newlyfulfilledproducts.some((product2) => {
          product.id == product2.id;
        });
      });
      for (let product of oldfulfilledproducts) {
        product.status = "pending";
      }
      for (let product of newlyfulfilledproducts) {
        product.status = "fulfilled";
      }
    },
  },
  async mounted() {
    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);
        this.userType = userDoc.data().userType;
        const orders = [];
        const ordersRef = collection(
          db,
          "Eco-Entrepreneur",
          user.uid,
          "Orders"
        );
        const allOrdersSnapshot = await getDocs(ordersRef);
        for (const orderDoc of allOrdersSnapshot.docs) {
          const productRef = doc(db, "Products", orderDoc.data().productName);
          const productSnapshot = await getDoc(productRef);
          // console.log(productSnapshot.data().pictures);
          let pictures = [];
          if (productSnapshot.exists()) {
            pictures = productSnapshot.data().pictures || [];
          }
          orders.push({
            order: orderDoc.id,
            address: orderDoc.data().shippingAddress,
            product: orderDoc.data().productName,
            orderPlacedAt: orderDoc.data().orderPlacedAt.toDate(),
            orderDate: orderDoc.data().orderPlacedAt.toDate().toDateString(),
            productPicture: pictures,
            buyer: orderDoc.data().buyerUsername,
            quantity: orderDoc.data().productQuantity,
            status: "pending",
          });
        }
        this.orders = orders.sort((a, b) => b.orderPlacedAt - a.orderPlacedAt);
        console.log(this.orders);
      }
    });
  },
};
</script>

<template>
  <div>
    <Divider align="center" :class="$style.ordersHeader">ORDERS:</Divider>
  </div>
  <div>
    <DataTable
      v-model:selection="selectedProduct"
      sortField="status"
      :sortOrder="-1"
      :value="orders"
      tableStyle="min-width: 50rem"
    >
      <Column field="order" header="Order ID"></Column>
      <Column field="product" header="Product"></Column>
      <Column header="Product Image">
        <template #body="slotProps">
          <Image
            :src="slotProps.data.productPicture"
            alt="Image"
            width="100"
            preview
          />
        </template>
      </Column>
      <Column field="quantity" header="Quantity"></Column>
      <Column field="address" header="Address"></Column>
      <Column field="orderDate" header="Order Date" sortable></Column>
      <Column field="status" header="Order Status"></Column>
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
    </DataTable>
  </div>
</template>

<style module>
.ordersHeader {
  font-size: 24px;
  font-weight: bold;
  color: #657b61;
}
</style>
