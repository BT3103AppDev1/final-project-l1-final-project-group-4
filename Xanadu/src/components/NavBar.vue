<template>
  <div>
    <div class="shipping-note">Free shipping for all orders!</div>
    <Menubar :model="items" style="align-items: center;">
      <template #start>
        <img alt="logo" src="../assets/xanadu.png" height="50" class="mr-2"/>
      </template>

      <template #item="{ label, item, props, root, hasSubmenu }">
        <div>
          <RouterLink v-if="item.route" v-slot="routerProps" :to="item.route">
            <span v-bind="props.icon" />
            <span v-bind="props.label">{{ label }}</span>
          </RouterLink>
        </div>
      </template>

      <template #end>
        <Button icon="pi pi-shopping-cart" @click="$router.push('/cart')" class="cart-button"></Button>
        <div class="profile-dropdown">
          <Button icon="pi pi-user" class="profile-pic"></Button>
          <div class="dropdown-content">
            <a @click="$router.push('/register')" class="dropdown-item">Register</a>
            <a @click="$router.push('/login')" class="dropdown-item">Login</a>
            <a @click="signOut" class="dropdown-item">Logout</a>
          </div>
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  components: {
    RouterLink,
  },

  data() {
    return {
      user: false,

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
  min-width: 160px;
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
