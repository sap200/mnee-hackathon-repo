<template>
  <div class="home">
    <hosted-page/>
  </div>
</template>

<script>
// @ is an alias to /src
import HostedPage from '@/components/HostedPage.vue'

export default {
  name: 'HostedPageView',
  components: {
    HostedPage
  }
}
</script>
