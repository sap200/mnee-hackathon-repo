<template>
  <div class="home">
    <account-page/>
  </div>
</template>

<script>
// @ is an alias to /src
import AccountPage from '@/components/AccountPage.vue'

export default {
  name: 'AccountPageView',
  components: {
    AccountPage
  }
}
</script>
