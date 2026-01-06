import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import AccountPageView from '@/views/AccountPageView.vue'
import CheckoutPageView from '@/views/CheckoutPageView.vue'
import HostedPageView from '@/views/HostedPageView.vue'
import PaymentStatusView from "@/views/PaymentStatusView.vue";
import PayoutPageView from "@/views/PayoutPageView.vue";
import DocsPageView from "@/views/DocsPageView.vue";
import AppListView from "@/views/AppListView.vue";
import AppDetailsView from "@/views/AppDetailsView.vue";
import SubscriptionPageView from "@/views/SubscriptionPageView.vue";
import HostedSubscriptionPageView from "@/views/HostedSubscriptionPageView.vue";





const routes = [
  {
    path: '/',
    name: '',
    component: AppLayout,
    children: [
      {
        path: 'product',
        name: 'product',
        component: ()=>import('../views/ProductPageView.vue'),
        meta: { title: 'Products', showInNav: true }
      },
      {
        path: 'checkout-links',
        name: 'checkout-links',
        component: CheckoutPageView,
        meta: { title: 'Checkouts', showInNav: true }
      },
      {
        path: 'payouts',
        name: 'payouts',
        component: PayoutPageView,
        meta: { title: 'Payouts', showInNav: true }
      },
      {
        path: 'appList',
        name: 'appList',
        component: AppListView,
        meta: { title: 'Apps', showInNav: true }
      },
      {
        path: 'subscriptionList',
        name: 'subscriptionList',
        component: SubscriptionPageView,
        meta: { title: 'Subscriptions', showInNav: true }
      },
      
      {
        path: 'docs',
        name: 'docs',
        component: DocsPageView,
        meta: { title: 'Docs', showInNav: true }
      },
      {
        path: 'merchant',
        name: 'merchant',
        component: AccountPageView,
        meta: { title: 'Merchant', showInNav: true }
      },
      {
        path: '/app-details/:appId/:appKey', // dynamic segment :id
        name: 'AppDetails',
        component: AppDetailsView,
        props: true // makes route param available as a prop
      },
    ],
  },

  {
    path: '/hosted-checkout-page/:id', // dynamic segment :id
    name: 'HostedPage',
    component: HostedPageView,
    props: true // makes route param available as a prop
  },

  {
    path: '/hosted-subscription-page/:subId', // dynamic segment :id
    name: 'HostedSubscriptionPage',
    component: HostedSubscriptionPageView,
    props: true // makes route param available as a prop
  },

  {
    path: "/status/:myStatus",
    name: "PaymentStatus",
    component: PaymentStatusView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
