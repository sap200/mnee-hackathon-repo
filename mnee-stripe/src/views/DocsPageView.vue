<template>
  <div class="home">
    <docs-page/>
  </div>
</template>

<script>
// @ is an alias to /src
import DocsPage from '@/components/DocsPage.vue'

export default {
  name: 'DocsPageView',
  components: {
    DocsPage
  }
}
</script>
