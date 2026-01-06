<template>
  <div class="home">
    <checkout-page/>
  </div>
</template>

<script>
// @ is an alias to /src
import CheckoutPage from '@/components/CheckoutPage.vue'

export default {
  name: 'CheckoutPageView',
  components: {
    CheckoutPage
  }
}
</script>
