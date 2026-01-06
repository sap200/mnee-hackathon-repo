<template>
  <div class="hosted-container">
    <!-- HEADER -->
    <header class="header">
      <h1>Subscription Payment</h1><hr>
      <br><br>
      <div class="header-meta">
        <span>
          <strong>App Id:</strong>
          <span class="highlight">{{ app.id }}</span>
        </span>
        <span>
          <strong>App Name:</strong>
          <span class="highlight">{{ app.name }}</span>
        </span>
        <span>
          <strong>Customer:</strong>
          <span class="highlight">{{ subscription.customerId }}</span>
        </span>
      </div>
    </header><br><br>

    <!-- PLAN DETAILS -->
    <section class="card">
      <h2 class="card-title">Plan Details</h2><hr>

      <div class="info-grid">
        <div class="info-item">
          <span class="label">Plan Name: </span>
          <span class="value strong">{{ plan.name }}</span>
        </div>

        <div class="info-item">
          <span class="label">Code: </span>
          <span class="value code">{{ plan.code }}</span>
        </div>

        <div class="info-item">
          <span class="label">Price: </span>
          <span class="value price">
            {{ plan.amount }} {{ plan.currency }}
            <span class="interval">/ {{ plan.interval }}</span>
          </span>
        </div>

        <div class="info-item">
          <span class="label">Status: </span>
          <span class="badge" :class="plan.status">
            {{ plan.status }}
          </span>
        </div>
      </div>

      <div class="features">
        <span class="label">Features</span>
        <ul>
          <li v-for="(f, i) in plan.features" :key="i">
            ✔ {{ f }}
          </li>
        </ul>
      </div>
    </section>

    <!-- SUBSCRIPTION DETAILS -->
    <section class="card accent">
      <h2 class="card-title">Subscription Details</h2><hr>

      <div class="info-grid">
        <div class="info-item">
          <span class="label">Subscription ID: </span>
          <span class="value mono">{{ subscription.id }}</span>
        </div>

        <div class="info-item">
          <span class="label">Plan ID: </span>
          <span class="value mono">{{ subscription.planId }}</span>
        </div>

        <div class="info-item">
          <span class="label">Renewal Mode: </span>
          <span class="value">{{ subscription.renewalMode }}</span>
        </div>

        <div class="info-item">
          <span class="label">Status: </span>
          <span class="badge" :class="subscription.status">{{ subscription.status }}</span>
        </div>

        <div class="info-item">
          <span class="label">Period Start: </span>
          <span class="value">
            {{ formatDate(subscription.currentPeriodStart) }}
          </span>
        </div>

        <div class="info-item">
          <span class="label">Period End: </span>
          <span class="value">
            {{ formatDate(subscription.currentPeriodEnd) }}
          </span>
        </div>
      </div>
    </section>

    <!-- PAYMENT ACTION -->
    <section class="card pay-card" v-if="subscription.status=='PENDING' || subscription.status == 'ACTIVE'">
      <h2 class="card-title">Complete Payment</h2><hr>

      <form @submit.prevent="pay" class="payment-form">
        <label>Wallet Import Format (WIF): </label>
        <input
          v-model="wif"
          type="password"
          placeholder="Enter your WIF"
          required
        />

        <div class="actions">
          <button type="submit" class="btn primary">
            Pay Now
          </button>
          <button type="button" class="btn secondary" @click="cancel">
            Cancel
          </button>
        </div>
      </form>
    </section>

    <!-- PAYMENT HISTORY -->
    <section class="card">
      <h2 class="card-title">Payment History</h2><hr>

      <table class="table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="txn in transactions" :key="txn.txnId">
            <td class="mono">{{ txn.tx_id }}</td>
            <td>
              <span class="badge" :class="txn.status.toLowerCase()">
                {{ txn.status }}
              </span>
            </td>
            <td>
              <a
                :href="'https://whatsonchain.com/tx/' + txn.tx_id + '?tab=m8eqcrbs'"
                target="_blank"
                class="link"
              >
                View
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <PaymentModal
        :visible="showPaymentModal"
        title="Processing Payment"
        message="Please wait until the payment is completed. Do not close or refresh the page."
    />

  </div>
</template>

<script>
import { useToast } from "vue-toastification";
import { HOST_URL, MNEE_HOST_URL} from '@/constants.js';
import axios from 'axios';
import PaymentModal from "@/components/PaymentModal.vue";


export default {
  name: "HostedSubscriptionPage",
  components: {
    PaymentModal,
  },

  data() {
    return {
      subId: "",
      wif: "",
      showPaymentModal: false,

      app: {},

      plan: {},

      subscription: {},

      transactions: [],
    };
  },

  async mounted() {
    this.subId = this.$route.params.subId;
    await this.getSubscription()
    await this.getPlanDetails();
    await this.getAppDetails();
  },

  methods: {
    formatDate(d) {
      if(d == null) {
        return "-"
      }
      return new Date(d).toLocaleDateString();
    },

    async getSubscription() {

      const toast = useToast();
      try {
        const response = await axios.get(`${HOST_URL}/subscription/${this.subId}/get-sub-by-id`);
        if(response.data.status=='success') {
          this.subscription = response.data.customerSubscription;
          this.transactions = this.subscription.detailsMapList;
          console.log(this.subscription);
        } else {
          console.log(response.data);
          toast.error(response.data.errorMessage);
        }


      } catch(error) {
        console.log(error);
        toast.error("Error fetching subscription details");
      }

    },

    async getPlanDetails() {
      const planId = this.subscription.planId;
      const toast = useToast();

      try {
        const response = await axios.get(`${HOST_URL}/subscription/${planId}/get-plan-by-id`);
        if(response.data.status == 'success') {
          this.plan = response.data.plan;
        } else {  
          console.log(response.data);
          toast.error(response.data.errorMessage);
        }

      } catch(error) {
        console.log(error);
        toast.error("Error fetching plan details");
      }
    },

     async getAppDetails() {
      const appId = this.subscription.appId;
      const toast = useToast();

      try {
        const response = await axios.get(`${HOST_URL}/subscription/${appId}/get-app`);
        if(response.data.status == 'success') {
          this.app = response.data.app;
        } else {  
          console.log(response.data);
          toast.error(response.data.errorMessage);
        }

      } catch(error) {
        console.log(error);
        toast.error("Error fetching app details");
      }
    },



    async pay() {
      console.log("WIF:", this.wif);
      const toast = useToast();

      try {
        this.showPaymentModal = true;
        const recipient = this.subscription.merchantWalletAddress;
        const amount = this.plan.amount;
        const myWif = this.wif.trim();
        if(myWif == null || myWif == "") {
            toast.warning("Wif is empty !");
            return;
        }

        // Prepare the transfer request
        const request = {
              wif: myWif,
              recipientAddress: recipient,
              amount: amount
        }

        console.log(request);

        const responseMNEE = await axios.post(`${MNEE_HOST_URL}/api/mnee/mnee-transfer`, request);
        console.log(responseMNEE.data);
        const springPayload = {
            ticketId: responseMNEE.data.ticketId,
            detailsMap: responseMNEE.data.details
        }

        console.log("spring-payload: ");
        console.log(springPayload);

        const response = await axios.post(`${HOST_URL}/subscription/${this.subId}/update-sub-details-map`, springPayload);
        if(response.data.status == 'success') {
          console.log("SUCCESS in uploading");
          console.log(response.data);
        } else {
          console.log("FAILURE IN SPRING UPLOADING")
          console.log(response.data);
        }

        if(responseMNEE.data.finalStatus == 'SUCCESS') {
          toast.success("PAYMENT SUCCESSFUL");
        } else if (responseMNEE.data.finalStatus == 'BROADCASTING') {
          toast.warning("PAYMENT NOT FINALIZED, BROADCASTING");
        } else {
          toast.error("PAYMENT FAILED");
        }

      } catch(error) {
          console.log(error);
          toast.error("Payment failed.");
      } finally {
        this.showPaymentModal = false;
        this.wif = ""
        await this.getSubscription()
      }
    },
    async cancel() {
      console.log("cancel");
      const toast = useToast();
      try {
        const payload = {
          planId: this.subscription.planId,
          customerId: this.subscription.customerId
        }
        const response = await axios.post(`${HOST_URL}/subscription/${this.subId}/cancel-subscription`, payload);
        if(response.data.status == 'success') {
          toast.success("Successfully cancelled the subscription");
        } else {
          console.log(response.data);
          toast.error(response.data.errorMessage);
        }
      } catch(error) {
        console.log(error);
        toast.error("Failed to cancel the subscription");
      } finally {
        await this.getSubscription();
      }
    },
  },
};
</script>

<style scoped>
/* LAYOUT */
.hosted-container {
  max-width: 980px;
  margin: 40px auto;
  padding: 0 16px;
}

/* HEADER */
.header h1 {
  font-size: 30px;
  margin-bottom: 10px;
  color: #1f2937;
}

.header-meta {
  font-size: 16px;
  color: #444;
  display: flex;
  gap: 28px;
}

.highlight {
  color: #2563eb;
  font-weight: 600;
}

/* CARD */
.card {
  background: white;
  border-radius: 14px;
  padding: 26px;
  margin-bottom: 26px;
  border: 1px solid #e5e7eb;
  overflow-x: auto;
  max-width: 100%;
}

.card.accent {
  border-left: 5px solid #2563eb;
}

.card.pay-card {
  border-left: 5px solid #16a34a;
}

.card-title {
  font-size: 22px;
  margin-bottom: 18px;
  color: #111827;
}

/* INFO GRID */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

.label {
  font-size: 14px;
  color: #6b7280;
}

.value {
  font-size: 17px;
  color: #111827;
}

.value.strong {
  font-size: 19px;
  font-weight: 600;
}

.value.price {
  color: #16a34a;
  font-size: 20px;
  font-weight: 700;
}

.interval {
  font-size: 14px;
  color: #6b7280;
}

.code {
  background: #eef2ff;
  padding: 4px 10px;
  border-radius: 8px;
}

/* FEATURES */
.features ul {
  margin-top: 8px;
  padding-left: 20px;
  font-size: 16px;
}

/* BADGES */
.badge {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.badge.ARCHIVED {
  background: #f3f4f6;
  color: #6b7280;
}

.badge.PENDING {
  background: #fef3c7;
  color: #92400e;
}

.badge.ACTIVE {
  background: #dcfce7;
  color: #166534;
}

.badge.FAILED {
  background: #fee2e2;
  color: #991b1b;
}

.badge.EXPIRED {
  background: #d11a1a;
  color: #2e1b99;
}


.badge.CANCELLED {
  background: #fee2e2;
  color: #b99f0a;
}

/* TABLE */
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
}

.table th {
  background: #f9fafb;
  padding: 14px;
  text-align: left;
}

.table td {
  padding: 14px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

/* LINKS */
.link {
  color: #2563eb;
  font-weight: 600;
}

/* PAYMENT */
.payment-form input {
  margin-top: 8px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 16px;
}

/* ACTIONS */
.actions {
  margin-top: 22px;
  display: flex;
  gap: 14px;
}

.btn {
  padding: 12px 22px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
}

.btn.primary {
  background: #16a34a;
  color: white;
  border: none;
}

.btn.secondary {
  background: #f3f4f6;
  border: none;
}

input {
    width: 75%;
}
</style>
