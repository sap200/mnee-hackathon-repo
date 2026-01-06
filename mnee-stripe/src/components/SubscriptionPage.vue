<template>
  <div class="page-container">
    <h1>Subscriptions</h1><hr>

    <!-- APP SELECT DROPDOWN -->
    <div class="form-row">
      <label>Select App:</label>
      <select v-model="selectedAppKey" @change="loadSubscriptions">
        <option
          v-for="app in apps"
          :key="app.appKey"
          :value="app.appKey"
        >
          {{ app.name }}
        </option>
      </select>
    </div>

    <!-- SUBSCRIPTIONS TABLE -->
    <div class="card" v-if="subscriptions.length">
      <h2>Subscriptions</h2>

      <table class="subscriptions-table">
        <thead>
          <tr>
            <th>Subscription ID</th>
            <th>Plan ID</th>
            <th>Customer ID</th>
            <th>Status</th>
            <th>Period Start</th>
            <th>Period End</th>
            <th>Renewal Mode</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="sub in subscriptions" :key="sub.id">
            <td>{{ sub.id }}</td>
            <td>{{ sub.planId }}</td>
            <td>{{ sub.customerId }}</td>
            <td>
              <span :class="['status', sub.status]">
                {{ sub.status }}
              </span>
            </td>
            <td>{{ formatDate(sub.currentPeriodStart) }}</td>
            <td>{{ formatDate(sub.currentPeriodEnd) }}</td>
            <td>{{ sub.renewalMode }}</td>
            <td>
              <a
                :href="`${sub.hostedSubscriptionPage}`"
                target="_blank"
                rel="noopener noreferrer"
                class="action-link"
              >
                Open
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="empty-state">
      No subscriptions found for this app.
    </p>
  </div>
</template>

<script>
import { HOST_URL } from "@/constants.js";
import { useToast } from "vue-toastification";
import axios from "axios";


export default {
  name: "SubscriptionsPage",

  data() {
    return {
      apps: [],
      selectedAppKey: "",
      subscriptions: [],
    };
  },

  async mounted() {
    await this.fetchAllApps();

    // Auto-select first app and load subscriptions
    if (this.apps.length > 0) {
      this.selectedAppKey = this.apps[0].appKey;
      this.loadSubscriptions();
    }
  },

  methods: {
    async fetchAllApps() {
      const toast = useToast();
      try {
        const merchantId = localStorage.getItem("merchantId");
        const response = await axios.get(
          `${HOST_URL}/subscription/${merchantId}/get-all-app`
        );
        this.apps = response.data;
      } catch (error) {
        toast.error("Failed to fetch apps");
        console.error(error);
      }
    },

    async loadSubscriptions() {
      const toast = useToast();
      try {
        const response = await axios.get(
          `${HOST_URL}/subscription/${this.selectedAppKey}/get-all-sub`
        );
        this.subscriptions = response.data;
      } catch (error) {
        toast.error("Error loading subscriptions");
        console.error(error);
      }
    },

    formatDate(dateStr) {
      if(dateStr == null) {
        return "-"
      }
      return new Date(dateStr).toLocaleDateString();
    },
  },
};
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 16px;
}

h1 {
  text-align: center;
  margin-bottom: 24px;
}

/* APP SELECT */
.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.form-row label {
  width: 140px;
  font-weight: 600;
}

.form-row select {
  flex: 1;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

/* CARD */
.card {
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

/* TABLE */
.subscriptions-table {
  width: 100%;
  border-collapse: collapse;
}

.subscriptions-table th,
.subscriptions-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  text-align: left;
}

.subscriptions-table th {
  background: #f8f9fb;
  font-weight: 600;
}

/* STATUS BADGES */
.status {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.status.PENDING {
  background: #fef3c7;
  color: #92400e;
}

.status.ACTIVE {
  background: #dcfce7;
  color: #166534;
}

.status.FAILED {
  background: #fee2e2;
  color: #991b1b;
}

.status.EXPIRED {
  background: #d11a1a;
  color: #2e1b99;
}


.status.CANCELLED {
  background: #fee2e2;
  color: #b99f0a;
}

/* ACTION LINK */
.action-link {
  display: inline-block;
  padding: 6px 10px;
  background: #0066cc;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
}

.action-link:hover {
  background: #004999;
}

/* EMPTY STATE */
.empty-state {
  text-align: center;
  margin-top: 20px;
  color: #777;
}
</style>
