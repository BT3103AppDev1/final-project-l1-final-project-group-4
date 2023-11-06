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

            <a v-if="!isLoggedIn" @click="$router.push('/register')" class="dropdown-item">Register</a>
            <a v-if="!isLoggedIn" @click="$router.push('/login')" class="dropdown-item">Login</a>
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
//brian - testing for conditional rendering of authentication buttons (register/login/logout)
import firebaseApp from "../firebase.js"
import {ref, watchEffect} from 'vue'
import router from "../router/index.js";
import { doc, getDoc, getFirestore } from "firebase/firestore";
const isLoggedIn = ref(false)
const isBuyer = ref(false)
const isSeller = ref(false)

const auth = getAuth();
const db = getFirestore();

//test
router.beforeEach( (to, from, next) => {
  // console.log("router beforeEach runned!")
  // console.log("User status: ", isLoggedIn.value)

  //clear user logged in status
  isLoggedIn.value = false
  isBuyer.value = false
  isSeller.value = false

  onAuthStateChanged(auth, function(user) {
    // console.log("onAuthState runned!")

    if(user){
      isLoggedIn.value = true

      //retrieve user type
      const userDocRef = doc(db, "Users", user.uid)
      const userDoc = getDoc(userDocRef)
      userDoc.then((userDoc) => {
        const userInfo = userDoc.data()
        const userType = userInfo.userType

        if(userType == "Eco-Entrepreneur") {
          isSeller.value = true
          // console.log("Is Seller type!")
        } else if (userType == "Green Ranger") {
          isBuyer.value = true
          // console.log("Is buyer type!")
        }
      })
    } 
    else {
      isLoggedIn.value = false
    }

    // console.log("User status after onAuthState: ", isLoggedIn.value)

    //Pending warning
    // The "next" callback was called more than once in one navigation guard when going from "/" to "/profile". It should be called exactly one time in each navigation guard. This will fail in production.
    // console.log("the from.name : ", from.name)
    // console.log("the to.name : ", to.name)

    if (to.name!=='login' && to.name!=='register'){
      if(!isLoggedIn.value){
        console.log("User is not logged in. Redirecting...")
        // not logged in, redirect
        next({name: 'login'})
      }
      else{
        // is logged in, go whereever im going
        next()
      }
    }
    else {
      // going login and register, does not require auth 
      next()
    }
  })

})

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
