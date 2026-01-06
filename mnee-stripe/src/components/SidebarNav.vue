<template>
  <aside class="sidebar">
    <div class="logo">🏦 RAPYD MNEE</div>

    <nav class="nav">
      <RouterLink
        v-for="route in navRoutes"
        :key="route.name"
        :to="{ name: route.name }"
        class="nav-item"
        active-class="active"
      >
        {{ route.meta.title }}
      </RouterLink>
    </nav>

    <!-- <div class="bottom">
      <RouterLink
        to="/account"
        class="nav-item"
        active-class="active"
      >
        Account
      </RouterLink>
    </div> -->
  </aside>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { LOGIN_MICRO_URL, HOST_URL } from '@/constants.js'
import axios from 'axios'

const router = useRouter()

const navRoutes = computed(() =>
  router
    .getRoutes()
    .find(r => r.path === '/')
    .children
    .filter(r => r.meta?.showInNav)
)

const REQUIRED_KEYS = [
  'userEmail',
  'walletAddress',
  'merchantId',
  'merchantApiKey',
  'token'
]

onMounted(async () => {

    try {
        const isInvalidSession = REQUIRED_KEYS.some(
            key => !localStorage.getItem(key)
        )

        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')        
        console.log("code", code, params);
        console.log(isInvalidSession)
        if(code && isInvalidSession) {
            // make an api call to get merchant by code
            const response = await axios.get(`${HOST_URL}/merchant/get-by-code/${code}`)
            if(response.data.status == 'success') {
                const userEmail = response.data.merchant.email;
                const walletAddress = response.data.merchant.walletAddress;
                const merchantApiKey = response.data.merchant.apiKey;
                const merchantId = response.data.merchant.id;
                const token = response.data.merchant.temporaryClientToken;

                localStorage.clear();
                localStorage.setItem('userEmail', userEmail);
                localStorage.setItem('walletAddress', walletAddress);
                localStorage.setItem('merchantId', merchantId);
                localStorage.setItem('merchantApiKey', merchantApiKey);
                localStorage.setItem('token', token);
            
            } else {
                console.log(response.data);
            }

        } else if (isInvalidSession) {
            console.log(isInvalidSession)
            localStorage.clear()
            window.location.replace(LOGIN_MICRO_URL);
        } 
    } catch(error) {
        console.log(error, LOGIN_MICRO_URL);
        localStorage.clear()
        window.location.replace(LOGIN_MICRO_URL);
    }
})



</script>

<style scoped>
.sidebar {
  width: 240px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #0f172a, #020617);
  color: #cbd5f5;
  overflow: hidden;
}

/* Logo / Header */
.logo {
  padding: 18px 16px;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.5px;
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

/* Navigation */
.nav {
  flex: 1;
  padding: 12px;
}

/* Nav item */
.nav-item {
  display: block;
  padding: 12px 14px;
  text-decoration: none;
  text-align: left;
  font-weight: 500;
  color: #cbd5f5;
  position: relative;
  margin-bottom: 10px;
  transition:
    background 0.25s ease,
    color 0.25s ease;
}

/* Hover state */
.nav-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
}

/* hover softens divider */
.nav-item:hover::after {
  background: rgba(255, 255, 255, 0.14);
}

/* Active route (gradient highlight) */
.nav-item.active {
  background: linear-gradient(90deg, #6366f1, #22d3ee);
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.35);
}

/* Optional: subtle left indicator for active item */
.nav-item.active::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 8px;
  bottom: 8px;
  width: 4px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
}

.nav-item::after {
  content: '';
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

/* remove divider from last item */
.nav-item:last-child::after {
  display: none;
}

</style>
