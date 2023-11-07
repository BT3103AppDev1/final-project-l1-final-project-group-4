<script >
import { RouterLink, RouterView } from 'vue-router'
import Products from '@/components/Marketplace/marketplace_components/Products.vue'

export default {
    name: 'App',
    components: {
        Products
    }
}
</script>

<template>
  <main>
    <Products />
    
  </main>
</template>

