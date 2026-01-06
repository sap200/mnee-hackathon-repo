<template>
  <div class="checkout-page">
    <h1>Checkout Sessions</h1><hr>

    <div class="table-wrapper">
      <table class="checkout-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Amount</th>
            <th>Source</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Transaction Id</th>
            <th>Status</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="session in sessions" :key="session.id">
            <td>{{ session.id }}</td>
            <td>{{ session.name }}</td>
            <td>{{ session.totalAmount }} {{ session.currency }}</td>
            <td>{{ session.source }}</td>

            <td>{{ formatDate(session.createdAt) }}</td>
            <td>{{ formatDate(session.updatedAt) }}</td>

            <td class="txn-cell">{{ session.transactionId || "-" }}</td>
            <td>
              <span
                class="status-badge"
                :class="{
                  created: session.status === 'CREATED',
                  failed: session.status === 'FAILED',
                  success: session.status === 'PAID',
                  cancelled: session.status === 'CANCELLED'
                }"
              >
                {{ session.status }}
              </span>
            </td>

            <td>
              <a
                v-if="session.hostedPage"
                :href="session.hostedPage"
                target="_blank"
                class="action-link"
              >
                ↗️
              </a>
              <span v-else>-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { HOST_URL } from '@/constants.js';

export default {
  name: "CheckoutPage",
  data() {
    return {
      // Replace with real API call
      sessions: [],
    };
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "-";
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      };
      return new Date(dateString).toLocaleString(undefined, options);
    },

    async fetchAllCheckoutSessions() {
        try {
            const merchantId = localStorage.getItem('merchantId');
            const response = await axios.get(`${HOST_URL}/checkout-session/${merchantId}/get-all-checkout-session-by-merchant-id`);
            console.log(response.data)
            this.sessions = response.data;
        } catch(error) {
            console.log(error);
        }
    }
  },

  mounted() {
        this.fetchAllCheckoutSessions();
  }
};
</script>

<style scoped>
.checkout-page {
  padding: 20px;
  font-family: 'Lucida Fax';
}

h1 {
  font-size: 24px;
  margin-bottom: 16px;
}

/* Wrapper for horizontal scroll if needed */
.table-wrapper {
  overflow-x: auto;
}

/* Table styling */
.checkout-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.checkout-table th,
.checkout-table td {
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
}

.checkout-table th {
  background-color: #f4f4f9;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
}

.checkout-table tbody tr {
  transition: background 0.2s;
}

.checkout-table tbody tr:hover {
  background-color: #f9f9f9;
}

/* Transaction ID cell - scrollable */
.txn-cell {
  max-width: 180px;
  overflow-x: auto;
  white-space: nowrap;
  padding: 8px 12px;
  border-radius: 4px;
  font-family: monospace;
  cursor: text;
}

.txn-cell:active {
  cursor: grabbing;
}

/* Optional: subtle scrollbar */
.txn-cell::-webkit-scrollbar {
  height: 5px;
}

.txn-cell::-webkit-scrollbar-thumb {
  background-color: rgb(204, 204, 204);
  border-radius: 2px;
}

/* Status badges */
.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: bold;
  color: white;
  font-size: 13px;
}

.status-badge.created {
  background-color: #f0ad4e; /* yellow */
}

.status-badge.success {
  background-color: #5cb85c; /* green */
}

.status-badge.failed {
  background-color: #e01e1e; /* red */
}

.status-badge.cancelled {
  background-color: #2c2c27; /* red */
}

/* Action link styling */
.action-link {
  color: #0066cc;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s;
}

.action-link:hover {
  color: #004999;
  text-decoration: underline;
}
</style>
