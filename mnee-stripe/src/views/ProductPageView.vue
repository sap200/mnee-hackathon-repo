<template>
  <div class="home">
    <product-page/>
  </div>
</template>

<script>
// @ is an alias to /src
import ProductPage from '@/components/ProductPage.vue'

export default {
  name: 'ProductPageView',
  components: {
    ProductPage
  }
}
</script>
