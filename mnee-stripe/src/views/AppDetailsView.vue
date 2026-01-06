<template>
  <div class="home">
    <app-details/>
  </div>
</template>

<script>
// @ is an alias to /src
import AppDetails from '@/components/AppDetails.vue'

export default {
  name: 'AppDetailsView',
  components: {
    AppDetails
  }
}
</script>
