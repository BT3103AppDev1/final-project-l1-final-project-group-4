<template>
  <div v-if="user">
    <Dashboard />
  </div>
</template>

<script>
import Dashboard from "../components/Dashboard/Dashboard.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  components: {
    Dashboard,
  },
  data() {
    return {
      user: false,
    };
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
      }
    });
  },
};
</script>
