<template>
  <div>
    <div class="shipping">
      <p>Free shipping for all orders!</p>
    </div>

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

      <template #end style="width: 100px;">
        <Button @click="$router.push('/register')" label="Register" class="w-10rem mx-auto authentication_btns"></Button>
        <Button @click="$router.push('/login')" label="Login" class="w-10rem mx-auto authentication_btns"></Button>
        <Button @click="signOut" label="Logout" class="w-10rem mx-auto authentication_btns"></Button>
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
        {
          label: "Dashboard",
          route: "/dashboard"
        },
        {
          label: "Marketplace",
          route: "/marketplace"
        },
        {
          label: "Forum",
          route: "/forum"
        },
        {
          label: "Cart",
          route: "/cart"
        },
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
.p-menubar-root-list{
    align-items: center;
    width: 500px;
}

.authentication_btns {
  margin-inline: 10px;  
}

.navbar {
  display: flex;
  justify-content: center;
}

li a {
  display: block;
  color: #404040;
  text-align: center;
  padding: 16px;
  text-decoration: none;
  align-items: center;
  justify-content: center;
}

li {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.logo {
  display: block;
  width: 180px;
  padding: 0px 0px 0px 70px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.shipping {
  text-align: center;
  background-color: #738678;
  width: 100%;
  height: 100%;
  font-family: Montserrat;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 0.8px;
  color: var(--White, #fff);
}
</style>
