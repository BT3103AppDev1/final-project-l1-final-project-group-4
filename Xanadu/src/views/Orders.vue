<template>
  <div>
    <Toast></Toast>
    <div v-if="seller">
      <SellerPendingOrders @fulfilled="fulfilled" :key="refreshComp" />
      <SellerFulfilledOrders :key="refreshComp" />
    </div>
    <div v-else>
      <BuyerOrders />
    </div>
  </div>
</template>

<script>
import SellerPendingOrders from "../components/Marketplace/marketplace_components/SellerPendingOrders.vue";
import SellerFulfilledOrders from "../components/Marketplace/marketplace_components/SellerFulfilledOrders.vue";
import BuyerOrders from "../components/Marketplace/marketplace_components/BuyerOrders.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, collection } from "firebase/firestore";
const db = getFirestore();

export default {
  components: {
    BuyerOrders,
    SellerPendingOrders,
    SellerFulfilledOrders,
  },
  data() {
    return {
      user: "",
      userType: "",
      userDocRef: "",
      seller: false,
      refreshComp: 0,
    };
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
  methods: {
    async fulfilled() {
      console.log("fulfilled");
      this.refreshComp += 1;
    },
  },
};
</script>
