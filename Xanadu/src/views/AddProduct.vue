<script setup>
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import router from "../router/index.js";

const db = getFirestore();
const auth = getAuth();

const isLoading = ref(true); // New ref to handle the loading state
const isLoggedIn = ref(false);
const isBuyer = ref(false);
const isSeller = ref(false);

// Define the names of your public pages
const publicPages = ['login', 'register', 'landing'];

const checkUserStatus = async () => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      isLoading.value = true; // Start loading
      if (user) {
        // User is signed in
        isLoggedIn.value = true;
        const userDocRef = doc(db, 'Users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userInfo = userDocSnap.data();
          isSeller.value = userInfo.userType === 'Eco-Entrepreneur';
          isBuyer.value = userInfo.userType === 'Green Ranger';
        }
      } else {
        // No user is signed in
        isLoggedIn.value = false;
        isSeller.value = false;
        isBuyer.value = false;
      }
      isLoading.value = false; // Stop loading
      resolve();
    });
  });
};

onMounted(async () => {
  await checkUserStatus();
});
</script>


<script>
import NewProduct from '@/components/Marketplace/marketplace_components/NewProduct.vue'
import DashboardGR from "../components/Dashboard/Dashboard_GR/Dashboard.vue";

export default {
    name: 'App',
    components: {
        NewProduct
    }
}
</script>

<template>
    <main>
        <NewProduct v-if="isSeller"/>
        <div v-else class="Not-found">
            <h3 id="Title">Page Not Found !! </h3>
            <button class= "return-button" @click="$router.push('/marketplace')">Return to Marketplace</button>
        </div>
    </main>
</template>

<style scoped>
#Title {

    /* H3 */
    font-family: Montserrat;
    font-size: 32px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 44.8px */
    text-transform: capitalize;

}

.Not-found{
    display: grid;
    justify-content: center;
    justify-items: center;
}

.return-button{
    background-color: #748C70;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}
</style>