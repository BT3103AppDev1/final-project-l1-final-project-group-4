import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/DashboardView.vue";
import Forum from "../views/ForumView.vue";
import Marketplace from "../views/MarketplaceView.vue";
import AddProduct from '../views/AddProduct.vue'
import ProductView from '../views/ProductView.vue'

import AddThread from '../views/AddThread.vue';
import AddReply from '../views/AddReply.vue';
import ThreadReply from '../views/ThreadReplyView.vue';

import Cart from '../views/CartView.vue' // Import the Cart component here

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
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
      path: '/AddProduct',
      name: 'AddProduct',
      component: AddProduct
    },
    {
      path: '/product/:id',
      name: 'ProductView',
      component: ProductView
    },
    {
      path: '/cart', // Add the cart route here
      name: 'Cart',
      component: Cart

    },
    { path: '/AddThread', 
      name: 'AddThread',
      component: AddThread },
    {
        path: '/thread/:threadId',
        name: 'ThreadReply',
        component: () => import('../views/ThreadReplyView.vue'),
        props: true // to pass the threadId as a prop to the component
      },
      {
        path: '/thread/:id/addreply',
        name: 'AddReply',
        component: AddReply
    },

  ],
});

export default router;
