import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/DashboardView.vue";
import Forum from "../views/ForumView.vue";
import Marketplace from "../views/MarketplaceView.vue";

import Login from "../views/LoginView.vue";

import ThreadReply from "../views/ThreadReplyView.vue";

import Cart from "../views/CartView.vue"; // Import the Cart component here
import AddProduct from '../views/AddProduct.vue';
import ProductView from '../views/ProductView.vue';
import EditProduct from '../views/EditProduct.vue';
import Register from "../views/RegisterView.vue"; // Added this import
import AddThread from "../views/AddThread.vue"; // Added this import
import AddReply from "../views/AddReply.vue"; // Added this import

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
    },
    {
      path: "/forum",
      name: "forum",
      component: Forum,
    },
    {
      path: "/marketplace",
      name: "marketplace",
      component: Marketplace,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/AddProduct",
      name: "AddProduct",
      component: AddProduct,
    },
    {
      path: "/product/:id",
      name: "ProductView",
      component: ProductView,
    },
    {
      path: "/cart",
      name: "Cart",
      component: Cart,
    },
    { 
      path: "/AddThread", 
      name: "AddThread", 
      component: AddThread 
    },
    {
      path: "/thread/:threadId",
      name: "ThreadReply",
      component: () => import("../views/ThreadReplyView.vue"),
      props: true, // to pass the threadId as a prop to the component
    },
    {
      path: "/thread/:id/addreply",
      name: "AddReply",
      component: AddReply,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path:'/marketplace/product/:id/edit',
      name: 'EditProduct',
      component: EditProduct
    }
  ],
});

export default router;
