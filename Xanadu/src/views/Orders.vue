<template>
    <!-- <DataTable  tableStyle="min-width: 50rem">
    <Column field="code" header="Code"></Column>
    <Column field="name" header="Name"></Column>
    <Column field="category" header="Category"></Column>
    <Column field="quantity" header="Quantity"></Column>
</DataTable> -->
    
</template>

<script>
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
            orders: {}
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
            const coll = collection(db, this.userType, this.user.uid, 'Orders')
            const snapshot = await getCountFromServer(coll);
            console.log('count: ', snapshot.data().count);
            const allOrders = await getDocs(coll);
            allOrders.forEach(async (order) => {
                // const productcoll = collection(order, 'products')
                // const products = await getDocs(productcoll);
                console.log(order.get('products'));
                // const products = [];
                // const allProducts = order.data().products;
                // allProducts.forEach((product) => {
                //     console.log(product.data().desc);
            })


        })
    },
}
</script>