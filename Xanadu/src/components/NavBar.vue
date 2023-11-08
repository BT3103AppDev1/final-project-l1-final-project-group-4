<template>
  <div>
    <div class="shipping-note">Free shipping for all orders!</div>
    <Menubar :model="items" style="align-items: center;">
      <template #start>
        <img alt="logo" src="../assets/xanadu.png" height="50" class="mr-2"/>
      </template>

      <template #item="{ label, item, props, root, hasSubmenu }">
        <div>
          <RouterLink v-if="isLoggedIn" v-slot="routerProps" :to="item.route">
            <span v-bind="props.icon" />
            <span v-bind="props.label">{{ label }}</span>
          </RouterLink>
        </div>
      </template>

      <template #end>
        <!-- show the cart button is the user is a buyer -->
        <Button v-if="isBuyer" icon="pi pi-shopping-cart" @click="$router.push('/cart')" class="cart-button"></Button>
        <Button v-if="isSeller" @click="$router.push('/orders')" class="cart-button">Orders</Button>

        <div class="profile-dropdown">
          <Button icon="pi pi-user" class="profile-pic"></Button>
          <div class="dropdown-content">
            <a v-if="isSeller" class="dropdown-item">Account: Eco-Entrepreneur</a>
            <a v-if="isBuyer" class="dropdown-item">Account: Green Ranger</a>

            <a v-if="!isLoggedIn" @click="goToRegister" class="dropdown-item">Register</a>
            <a v-if="!isLoggedIn" @click="goToLogin" class="dropdown-item">Login</a>
            <!-- show the order tab under dropdown if the user is a seller -->
            <a v-if="isBuyer" @click="$router.push('/orders')" class="dropdown-item">Orders</a>
            <a v-if="isLoggedIn" @click="$router.push('/profile')" class="dropdown-item">My Profile</a>
            <a v-if="isLoggedIn" @click="signOut" class="dropdown-item">Logout</a>
          </div>
        </div>
      </template>
    </Menubar>
  </div>
</template>

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

router.beforeEach(async (to, from, next) => {
  if (isLoading.value) {
    await checkUserStatus(); // Wait for auth check to finish if still loading
  }

  const isPublicPage = publicPages.includes(to.name);

  if (!isPublicPage && !isLoggedIn.value) {
    next({ name: 'landing' });
  } else {
    next();
  }
});
</script>



<script>
import { RouterLink } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  components: {
    RouterLink,
  },

  data() {
    return {

      items: [
        { label: "Dashboard", route: "/dashboard" },
        { label: "Marketplace", route: "/marketplace" },
        { label: "Forum", route: "/forum" }
      ]
    }
  },

  methods: {
    signOut() {
      const auth = getAuth();
      auth.signOut()
        .then(() => {
          console.log("Sign Out completed");
          this.$router.push("/");
        }).catch((error) => console.log(error));
    },
    goToLogin() {
    console.log('Login button clicked');
    this.$router.push('/login');
  },
  goToRegister() {
    console.log('Register button clicked');
    this.$router.push('/register');
  },
  },
};
</script>

<style>
.navbar {
  display: flex;
  justify-content: space-between; /* Distribute space equally between elements */
}

.p-menubar-root-list {
  align-items: center;
  flex-grow: 1; /* Allow the menu items to take available space */
  display: flex;
  justify-content: center; /* Ensure items within this container are centralized */
}

.shipping-note {
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 0.8px;
  color: var(--White, #fff);
  background-color: #738678;
  padding: 5px 10px;
  width: 100%;
  text-align: center;
}

.cart-button, .profile-pic {
  background-color: #738678;
  border-color: #738678;
}

.p-menubar-root-list {
  align-items: center;
  width: 500px;
}

li a {
  display: block;
  color: #404040;
  text-align: center;
  padding: 16px;
  text-decoration: none;
}

li {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.profile-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  background-color: #f9f9f9;
  min-width: 230px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1000;
}

.profile-dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-item {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  border-bottom: 1px solid #e6e6e6;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #f1f1f1;
}

.cart-button {
  margin-right: 10px;
}

.profile-pic {
  margin-left: 10px;
  margin-right: 20px;
}

</style>
