
<script>
import Image from 'primevue/image';
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';   
import firebaseApp from "@/firebase.js";
import { setDoc, getDocs, doc, deleteDoc, getDoc, collection, getFirestore, getCountFromServer } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";  // 1. Import required functions

const db = getFirestore();

export default {

    data() {
        return {
            user: null,
            userType: null,
            orders: [],
            count: 0
        }
    },

    async mounted() {
        const auth = getAuth(firebaseApp);
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.user = user;
            }
            const userDocRef = doc(db, 'Users', this.user.uid);
            const userDoc = await getDoc(userDocRef);
            this.userType = userDoc.data().userType;
            console.log(this.user.uid);
            console.log(this.userType);
            const orders = [];
            const coll = collection(db, "Green Rangers", this.user.uid, 'Orders')
            const snapshot = await getCountFromServer(coll);
            this.count = snapshot.data().count;
            console.log(this.count);
            const allOrders = await getDocs(coll);
            const promises = allOrders.docs.map(async (orderDoc)=> {
                const productsRef = collection(orderDoc.ref, "Products");
                const productQuerySnapshot = await getDocs(productsRef);
                const products = []
                let totalcost = 0
                productQuerySnapshot.forEach(async (productDoc) => {
                    console.log(productDoc.data());
                    const product = doc(db, "Products", productDoc.data().productName);
                    const productSnapshot = await getDoc(product);
                    
                    const pictures = productSnapshot.data().pictures;
                    console.log(pictures);
                    products.push( {
                        title: productDoc.data().productName, 
                        cost: productDoc.data().productPrice, 
                        totalCost: productDoc.data().productPrice * productDoc.data().productQuantity,
                        pictures: pictures,
                        quantity: productDoc.data().productQuantity,
                    })
                    console.log(products);
                    totalcost += productDoc.data().productPrice * productDoc.data().productQuantity;
                })
                orders.push( {
                    order: orderDoc.id,
                    address: orderDoc.data().address,
                    products: products,
                    totalCost: totalcost
                })
                console.log(orders);
            })
            await Promise.all(promises);
            
            this.orders = orders;
            console.log(this.orders);

        })
    },
}
</script>

<template>
    <div v-if = "count == 0">
        <Divider align = "center"> No Order Yet</Divider>
    </div>
    <div v-for= "order in orders">
        <Divider align="center" type="solid" :class="$style.divider">
                <b>Order #{{ order.order }}</b>
        </Divider>
        
        <div class="card">
            <Card>
                <template #title> Address </template>
                <template #content>
                    <p class="m-0">
                        {{ order.address }}
                    </p>
                </template>
            </Card>
        </div>
        <div>
            <Card>
                <template  #title> Products </template>
                <template #content>
                    <DataTable scrollable scrollHeight="500px" :value = "order.products" tableStyle="min-width: 50rem">
                        <Column field="title" header="Product"></Column>
                        <Column header="Image">
                            <template #body="slotProps">
                                <Image :src="slotProps.data.pictures" alt="Image" width="200" preview />
                            </template>
                        </Column>
                        <Column field="quantity" header="Quantity"></Column>
                        <Column field="cost" header="Cost"></Column>
                        <Column field="totalCost" header="Subtotal"></Column>
                        <template class="text-right" #footer> Total Cost: ${{ order.totalCost }} </template>
                    </DataTable>
                </template>
            </Card>
        </div>
    </div>
    
</template>

<style module>
.divider {
    font-size: 25px;
    text-transform: uppercase;
    color: #738678
}

.noOrders {
    text-align: center;
}
</style>
