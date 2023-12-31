<script>
import Image from 'primevue/image';
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';   
import firebaseApp from "@/firebase.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const db = getFirestore();

export default {

    data() {
        return {
            user: null,
            userType: null,
            orders: [],
            count: 0,
            selectedProduct: []
        }
    },
    async mounted() {
        const auth = getAuth(firebaseApp);
        onAuthStateChanged(auth, async (user) => {
            if (user) {
            this.user = user;
            const userDocRef = doc(db, 'Users', user.uid);
            const userDoc = await getDoc(userDocRef);
            this.userType = userDoc.data().userType;
            const orders = [];
            const ordersRef = collection(db, 'Green Rangers', user.uid, 'Orders');
            const allOrdersSnapshot = await getDocs(ordersRef);

            for (const orderDoc of allOrdersSnapshot.docs) {
                const productsRef = collection(orderDoc.ref, "Products");
                const productQuerySnapshot = await getDocs(productsRef);

                const productsPromises = productQuerySnapshot.docs.map(async (productDoc) => {
                const productRef = doc(db, "Products", productDoc.data().productName);
                const productSnapshot = await getDoc(productRef);
                
                let pictures = [];
                if (productSnapshot.exists()) {
                    pictures = productSnapshot.data().pictures || [];
                }
                
                return {
                    title: productDoc.data().productName,
                    cost: productDoc.data().productPrice, 
                    totalCost: productDoc.data().productPrice * productDoc.data().productQuantity,
                    desc: productDoc.data().desc,
                    dimensions: productDoc.data().dimensions,
                    pictures: pictures,
                    quantity: productDoc.data().productQuantity,
                    shipping: productDoc.data().shippingAddress,
                    shortdesc: productDoc.data().shortdesc,
                    orderPlacedAt: productDoc.data().orderPlacedAt,
                };
                });

                const products = await Promise.all(productsPromises);
                const totalCost = products.reduce((acc, product) => acc + product.totalCost, 0);

                orders.push({
                order: orderDoc.id,
                address: orderDoc.data().shippingAddress,
                products: products,
                totalCost: totalCost,
                orderPlacedAt: orderDoc.data().orderPlacedAt.toDate() // Convert Timestamp to Date
            });
            }
            this.orders = orders.sort((a, b) => b.orderPlacedAt - a.orderPlacedAt); // Assuming you want newest first
            }
        })
    }
}
</script>

<template>
    <div>
        <Divider align="center" :class="$style.ordersHeader">PAST ORDERS:</Divider>
    </div>

    <div v-for="order in orders" :key="order.order">
        <Divider align="center" type="solid" :class="$style.divider">
            <span :class="$style.orderId">Order ID: {{ order.order }}</span>
        </Divider>
        <div class="card">
            <div class="card">
            <Card>
                <template #title>
                    <span :class="$style.addressTitle">Address:</span> 
                </template>
                <template #content>
                    <p class="m-0" :class="$style.addressContent">
                        {{ order.address }}
                    </p>
                </template>
            </Card>
        </div>
        </div>
    <div>
        <Card>
            <template  #title> Products </template>
            <template #content>
                <DataTable scrollable scrollHeight="500px" :value = "order.products" tableStyle="min-width: 50rem">
                    <Column field="title" header="Product"></Column>
                    <Column header="Image">
                        <template #body="slotProps">
                            <Image :src="slotProps.data.pictures" alt="Image" width="100" preview />
                        </template>
                    </Column>
                    <Column field="quantity" header="Quantity"></Column>
                    <!-- <Column field="shortdesc" header="Short Description"></Column> -->
                    <Column header="Cost">
                        <template #body="slotProps">
                            ${{ slotProps.data.cost.toFixed(2) }}
                        </template>
                    </Column>
                    <Column header="Subtotal">
                        <template #body="slotProps">
                            ${{ slotProps.data.totalCost.toFixed(2) }}
                        </template>
                    </Column>
                    <template class="text-right" #footer> Total Cost: ${{ order.totalCost }} </template>
                </DataTable>
            </template>
        </Card>
    </div>
    </div>
</template>

<style module>
.ordersHeader {
  font-size: 24px;
  font-weight: bold;
  color: #657B61; 
}

.orderId {
  font-size: 18px;
  color: #333333; 
}


.divider {
  font-size: 18px;
  font-weight: bold;
  color: #748C70; 
  margin-bottom: 20px; 
}


.addressContent {
  color: #757575;
  font-size: 18px; 
  line-height: 1.5;
}
</style>