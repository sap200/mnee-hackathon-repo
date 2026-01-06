<template>
  <div class="layout">
    <SidebarNav />
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import SidebarNav from '@/components/SidebarNav.vue'

</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;        /* lock layout height */
  overflow: hidden;    /* prevent body scroll */
}

.content {
  flex: 1;
  overflow-y: auto;    /* ✅ ONLY scrollable area */
  padding: 24px;
  background: #fff;
}
</style>
