<template>
  <div>
    <div class="shipping">
      <p>Free shipping for all orders!</p>
    </div>
    <div class="navbar">
      <img class="logo" src="../assets/xanadu.png" />
      <ul>
        <li>
          <RouterLink to="/dashboard">Dashboard</RouterLink>
        </li>
        <li>
          <RouterLink to="marketplace">Marketplace</RouterLink>
        </li>
        <li>
          <RouterLink to="forum">Forum</RouterLink>
        </li>
        <li>
          <RouterLink to="cart">Cart</RouterLink>
        </li>
        <li>
          <RouterLink to="register">Register</RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";

export default {
  components: {
    RouterLink,
  },
};
</script>

<style>
.navbar a.router-link-exact-active {
  color: #5a6d57;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.navbar {
  display: inline-flex;
  justify-content: center;
  align-items: center;
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
  padding: 0px 440px 0px 70px;
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
