<template>
  <div class="home">
    <payment-status/>
  </div>
</template>

<script>
// @ is an alias to /src
import PaymentStatus from '@/components/PaymentStatus.vue'

export default {
  name: 'PaymentStatusView',
  components: {
    PaymentStatus
  }
}
</script>
