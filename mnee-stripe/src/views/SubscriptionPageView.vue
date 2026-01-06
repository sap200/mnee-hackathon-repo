<template>
  <div class="home">
    <subscription-page/>
  </div>
</template>

<script>
// @ is an alias to /src
import SubscriptionPage from '@/components/SubscriptionPage.vue'

export default {
  name: 'SubscriptionPageView',
  components: {
    SubscriptionPage
  }
}
</script>
