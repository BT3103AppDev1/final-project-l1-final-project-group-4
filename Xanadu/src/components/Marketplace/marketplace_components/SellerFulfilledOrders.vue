<script>
import firebaseApp from "@/firebase.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
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
    };
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
          "Fulfilled Orders"
        );
        const allOrdersSnapshot = await getDocs(ordersRef);
        for (const orderDoc of allOrdersSnapshot.docs) {
          orders.push(orderDoc.data());
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
    <Toast> </Toast>
    <div>
      <Divider align="center" :class="$style.ordersHeader"
        >FULFILLED ORDERS:</Divider
      >
    </div>
    <div>
      <div class="card">
        <DataTable
          ref="dt"
          :value="orders"
          dataKey="order"
          :paginator="true"
          :rows="10"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          removableSort
          class="ecoFriendlyActivitiesTable"
        >
          <Column
            field="product"
            header="Product"
            headerClass="column-text-right"
            style="text-align: center"
            sortable
          ></Column>
          <Column
            header="Product Image"
            headerClass="column-text-right"
            style="text-align: center"
          >
            <template #body="slotProps">
              <Image
                :src="slotProps.data.productPicture"
                alt="Image"
                width="100"
                preview
              />
            </template>
          </Column>
          <Column
            field="quantity"
            header="Quantity"
            headerClass="column-text-right"
            style="text-align: center"
            sortable
          ></Column>
          <Column
            field="address"
            header="Address"
            headerClass="column-text-right"
            style="text-align: center"
            sortable
          ></Column>
          <Column
            field="orderDate"
            header="Order Date"
            sortable
            headerClass="column-text-right"
            style="text-align: center"
          ></Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style module>
.ordersHeader {
  font-size: 24px;
  font-weight: bold;
  color: #657b61;
}
</style>

<style scoped>
.ecoFriendlyActivitiesTable {
  width: 95vw;
  flex-shrink: 0;
  margin-left: 2vw;
  margin-bottom: 5vh;
  border: 0.15vw solid #738678;
  border-radius: 0.1vw;
}
</style>

<style lang="scss">
.column-text-right {
  .p-column-header-content {
    text-align: center; // or center
    display: block !important;
  }
}
</style>
