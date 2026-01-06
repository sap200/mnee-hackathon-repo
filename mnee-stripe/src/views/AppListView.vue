<template>
  <div class="home">
    <app-list/>
  </div>
</template>

<script>
// @ is an alias to /src
import AppList from '@/components/AppList.vue'

export default {
  name: 'AppListView',
  components: {
    AppList
  }
}
</script>
