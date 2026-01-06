<template>
  <div class="home">
    <PayoutPage/>
  </div>
</template>

<script>
// @ is an alias to /src
import PayoutPage from '@/components/PayoutPage.vue'

export default {
  name: 'PayoutPageView',
  components: {
    PayoutPage
  }
}
</script>
