<template>
  <div class="home">
    <hosted-subscription-page/>
  </div>
</template>

<script>
// @ is an alias to /src
import HostedSubscriptionPage from '@/components/HostedSubscriptionPage.vue'

export default {
  name: 'HostedSubscriptionPageView',
  components: {
    HostedSubscriptionPage
  }
}
</script>
