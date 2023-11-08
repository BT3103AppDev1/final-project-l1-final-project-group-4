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

    watch: {
        selectedProduct(newlyfulfilledproducts, oldfulfilledproducts) {
            oldfulfilledproducts.filter(product =>{
                !newlyfulfilledproducts.some(product2 => {
                    product.id == product2.id;
                })
            })
            for (let product of oldfulfilledproducts) {
                product.status = "pending";
            }
            for (let product of newlyfulfilledproducts) {
                product.status = "fulfilled";
            }
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

            if (this.userType == "Green Ranger") {
            
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
            } else {
                const orders = [];
                const ordersRef = collection(db, 'Eco-Entrepreneur', user.uid, 'Orders');
                const allOrdersSnapshot = await getDocs(ordersRef);
                for (const orderDoc of allOrdersSnapshot.docs) {


                    const productRef = doc(db, "Products", orderDoc.data().productName);
                    const productSnapshot = await getDoc(productRef);
                    console.log(productSnapshot.data().pictures);
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
                        status: "pending"
                    })    
                };
                this.orders = orders.sort((a, b) => b.orderPlacedAt - a.orderPlacedAt);
                console.log(this.orders);
            }   
    }})
}}
</script>

<template>
<div v-if = "userType == 'Green Ranger'" > 
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
</div>
<div v-else>
    <div>
        <Divider align="center" :class="$style.ordersHeader">ORDERS:</Divider>
    </div>
    <div>
        <DataTable v-model:selection="selectedProduct"  sortField="status" :sortOrder="-1" :value = "orders" tableStyle="min-width: 50rem">
            <Column field="order" header="Order ID"></Column>
                <Column field="product" header="Product"></Column>
                <Column header="Product Image">
                    <template #body="slotProps">
                        <Image :src="slotProps.data.productPicture" alt="Image" width="100" preview />
                    </template>
                </Column>
                <Column field="quantity" header="Quantity"></Column>
                <Column field="address" header="Address"></Column>
                <Column field="orderDate" header="Order Date" sortable></Column>
                <Column field="status" header="Order Status"></Column>
                <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        </DataTable>
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

.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.card p {
  /* Stylish font for the address */
  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
  color: #555555; /* Soft black for readability */
  line-height: 1.5; /* Adjust line spacing for better readability */
  padding: 15px; /* Add padding for spacing inside the card */
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
}

.divider {
  font-size: 18px;
  font-weight: bold;
  color: #748C70; /* Adjust the color to match your theme */
  margin-bottom: 20px; /* Space after divider */
}

.noOrders {
  text-align: center;
  font-size: 18px;
  color: #ff4d4d; /* Color for no orders message */
}

.addressContent {
  color: #757575;
  font-size: 18px; 
  line-height: 1.5;
}
</style>
