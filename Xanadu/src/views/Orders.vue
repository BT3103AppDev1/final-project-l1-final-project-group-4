<template>
  <div>
    <div v-if="seller">
      <SellerOrders />
      <SellerOrdersTJ />
    </div>
    <div v-else>
      <BuyerOrders />
    </div>
  </div>
</template>

<script>
import SellerOrders from "../components/Marketplace/marketplace_components/SellerOrders.vue";
import SellerOrdersTJ from "../components/Marketplace/marketplace_components/SellerOrdersTJ.vue";
import BuyerOrders from "../components/Marketplace/marketplace_components/BuyerOrders.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, collection } from "firebase/firestore";
const db = getFirestore();

export default {
  components: {
    SellerOrders,
    BuyerOrders,
    SellerOrdersTJ,
  },
  data() {
    return { user: "", userType: "", userDocRef: "", seller: false };
  },
  async mounted() {
    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
        this.userDocRef = doc(db, "Users", this.user.uid);
        const u = await getDoc(this.userDocRef);
        console.log(u.data());
        if (u.data().userType == "Eco-Entrepreneur") {
          this.seller = true;
        }
      }
    });
  },
};
</script>
