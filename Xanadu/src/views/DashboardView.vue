<template>
  <div>
    <div v-if="seller">
      <DashboardEE />
    </div>
    <div v-else>
      <DashboardGR />
    </div>
  </div>
</template>

<script>
import DashboardGR from "../components/Dashboard/Dashboard_GR/Dashboard.vue";
import DashboardEE from "../components/Dashboard/Dashboard_EE/Dashboard.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, collection } from "firebase/firestore";
const db = getFirestore();

export default {
  components: {
    DashboardGR,
    DashboardEE,
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
