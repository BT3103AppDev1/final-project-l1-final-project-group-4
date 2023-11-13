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
      selectedOrders: null,
      confirmShipAndFulfilDialog: false,
    };
  },
  methods: {
    confirmShipAndFulfil() {
      this.confirmShipAndFulfilDialog = true;
    },
    async shipAndFulfilOrders() {

      this.$toast.add({
        severity: "info",
        summary: "Shipping Orders...",
        // detail: "Activity Deleted",
        life: 3000,
      });
      for (var order of this.selectedOrders) {

        order.status = "Fulfilled";
        // console.log(order);

        try {
          const docRef = await addDoc(
            collection(
              db,
              "Eco-Entrepreneur/" + this.user.uid + "/Fulfilled Orders"
            ),
            order
          );
          await deleteDoc(
            doc(
              db,
              "Eco-Entrepreneur/" + this.user.uid + "/Orders/" + order.order
            )
          );
        } catch (error) {
          console.error("Error adding Order to Fulfilled Orders: ", error);
        }
      }
      this.$toast.add({
        severity: "success",
        summary: "Orders Shipped!",
        // detail: "Activity Deleted",
        life: 3000,
      });

      // then I need to delete all these orders from the Orders collection

      this.confirmShipAndFulfilDialog = false;
      this.selectedOrders = null;
      this.$emit("fulfilled");
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
        >PENDING ORDERS:</Divider
      >
    </div>
    <div>
      <div class="card">
        <DataTable
          ref="dt"
          :value="orders"
          v-model:selection="selectedOrders"
          dataKey="order"
          :paginator="true"
          :rows="10"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          removableSort
          class="ecoFriendlyActivitiesTable"
        >
          <Toolbar class="mb-4">
            <template #start>
              <Button
                label="Ship and Fulfil Order(s)"
                severity="success"
                @click="confirmShipAndFulfil"
                :disabled="!selectedOrders || !selectedOrders.length"
                style="
                  margin-right: 10px;
                  background-color: #738678;
                  border-color: white;
                "
              />
            </template>
          </Toolbar>
          <Column
            selectionMode="multiple"
            style="width: 5vw; text-align: center"
            :exportable="false"
            headerClass="column-text-right"
          ></Column>
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
    <Dialog
      v-model:visible="confirmShipAndFulfilDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i
          class="pi pi-exclamation-triangle"
          style="font-size: 2rem; margin: 10px"
        />
        <span v-if="selectedOrders">Ship and fulfil the selected orders?</span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          text
          @click="confirmShipAndFulfilDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          text
          @click="shipAndFulfilOrders"
        />
      </template>
    </Dialog>
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
    // color: white;
    // background: #404e3e;
    // margin: 0px;
  }
  // .p-sortable-column {
  //   text-align: center; // or center
  //   display: block !important;
  //   color: white;
  //   background: #404e3e;
  //   // margin: 0px;
  // }
}
</style>
