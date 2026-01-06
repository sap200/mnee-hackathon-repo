<template>
  <h1>Payouts</h1>
  <hr />
  <div class="page-container">

    <!-- BALANCE CARD -->
    <div class="card balance-card">
      <h2>Wallet Balance</h2>
      <p class="balance">{{ balance }} MNEE</p>
      <button class="primary-btn" @click="fetchBalance">Refresh Balance</button>
    </div>

    <!-- SEND TRANSACTION CARD -->
    <div class="card send-card">
      <h2>Send a Payout Transaction</h2>

      <form @submit.prevent="sendTransaction" class="form">
        <div class="form-group">
          <label>Your WIF (private key)</label>
          <input v-model="wif" type="text" placeholder="Enter your WIF" required />
        </div>

        <div class="form-group">
          <label>Recipient Address</label>
          <input v-model="recipient" type="text" placeholder="Recipient wallet address" required />
        </div>

        <div class="form-group">
          <label>Amount (MNEE)</label>
          <input v-model="amount" type="number" min="0" step="0.00001" placeholder="0.0" required />
        </div>

        <button class="primary-btn" type="submit">Send</button>
      </form>
    </div>

    <!-- RECENT TRANSACTIONS TABLE -->
    <div class="card history-card">
      <h2>Recent Transactions</h2>

      <table class="txn-table">
        <thead>
        <tr>
          <th>Tx Hash</th>
          <th>Block</th>
          <th>Amount</th>
          <th>Type</th>
          <th>Status</th>
          <th>Link</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="tx in recentTransactions" :key="tx.txid">
          <td class="tx-hash-cell">{{ tx.txid }}</td>
          <td>{{ tx.height }}</td>
          <td>{{ tx.humanAmount }} MNEE</td>
          <td>
            <span :class="['type-badge', tx.type]">{{ tx.type }}</span>
          </td>
          <td>
            <span :class="['status', tx.status]">
              {{ tx.status }}
            </span>
          </td>
          <td>
            <a 
              :href="`https://whatsonchain.com/tx/${tx.txid}?tab=m8eqcrbs`"
              target="_blank"
              class="tx-link"
            >
              🔗
            </a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <PaymentModal
        :visible="showPaymentModal"
        title="Processing Payout"
        message="Please wait until the payout is completed. Do not close or refresh the page."
    />

  </div>
</template>

<script>

import {MNEE_HOST_URL} from '@/constants.js';
import axios from 'axios';
import { useToast } from "vue-toastification";
import PaymentModal from "@/components/PaymentModal.vue";




export default {
  name: "PayoutPage",
  components: {
      PaymentModal
  },
  data() {
    return {
      wif: "",
      balance: "Loading...",
      recipient: "",
      amount: "",
      showPaymentModal: false,
      recentTransactions: []
    };
  },

  methods: {
    fetchBalance() {
      // Fire-and-forget async request
      this.balance = 'Loading...'
      const addrs = localStorage.getItem("walletAddress")
      axios.get(`${MNEE_HOST_URL}/api/mnee/balance/${addrs}`)
        .then(response => {
          this.balance = response.data.decimalAmount; // update reactive data
        })
        .catch(err => {
          console.error('Error fetching balance:', err);
          this.balance = 'Error fetching balance';
        });
    },

    async sendTransaction() {
      console.log("Sending transaction:");
      console.log("WIF:", this.wif);
      console.log("Recipient:", this.recipient);
      console.log("Amount:", this.amount);
      this.showPaymentModal = true;
      const toast = useToast();
      const payload = {
        wif: this.wif.trim(),
        recipientAddress: this.recipient.trim(),
        amount: this.amount,
      }

      console.log(payload);

      try {

          const response = await axios.post(`${MNEE_HOST_URL}/api/mnee/mnee-transfer`, payload);
          const status = response.data.details.status; // update reactive data
          this.showPaymentModal = false;
          if(status == "SUCCESS" || status == "MINED") {
              toast.success("Transaction succeeded")
          } else if (status == "FAILED") {
              toast.error(response.data.details.error);
              console.log(response.data);
          } else {
              toast.warning("Transaction is still Broadcasting");
          }

      } catch(error) {
          this.showPaymentModal = false;
          console.error('Error fetching balance:', error);
          toast.error(JSON.stringify(error));

      } finally {
         this.wif = "";
         this.recipient = "";
         this.amount = "0";
         await this.fetchBalance();
         await this.getTxnHistory();
      }
    },

    getTxnHistory() {
        const toast = useToast();
        const addrs = localStorage.getItem("walletAddress")
        axios.get(`${MNEE_HOST_URL}/api/mnee/txn-history/${addrs}`)
        .then(response => {
          this.recentTransactions = response.data.history; // update reactive data
        })
        .catch(err => {
          console.error('Error fetching transaction history:', err);
          toast.error("unable to load the transaction history");
        });

    }
  },

  mounted() {
      this.fetchBalance();
      this.getTxnHistory();
  }
};
</script>

<style scoped>
/* ===== Page Layout ===== */
.page-container {
  max-width: 900px;
  margin: auto;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* ===== Card ===== */
.card {
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 15px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
}

.card h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #222;
}

/* ===== Balance Card ===== */
.balance-card {
  text-align: center;
}

.balance {
  font-size: 26px;
  font-weight: bold;
  color: #3a0217;
  margin: 8px 0;
}

/* ===== Send Transaction Form ===== */
.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 13px;
  margin-bottom: 4px;
  font-weight: 600;
}

.form-group input {
  padding: 10px;
  border-radius: 10px;
  border: 1.5px solid #ddd;
  outline: none;
  font-size: 14px;
  transition: border 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  border-color: #2b7cff;
  box-shadow: 0 0 5px rgba(43, 125, 255, 0.3);
}

/* ===== Buttons ===== */
.primary-btn {
  background: linear-gradient(135deg, #2b7cff, #3daeff);
  color: white;
  padding: 10px 18px;
  font-size: 15px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}

/* ===== Transactions Table ===== */
.txn-table {
  width: 100%;
  border-collapse: collapse;
}

.txn-table th,
.txn-table td {
  padding: 10px 8px;
  text-align: left;
}

.txn-table thead {
  background: #f7f7f7;
}

.txn-table tbody tr {
  transition: background 0.25s ease, transform 0.15s ease;
  cursor: pointer;
}

.txn-table tbody tr:hover {
  background: #eef6ff;
  transform: translateY(-1px);
}

.tx-hash-cell {
  max-width: 200px;       /* set a reasonable width */
  overflow-x: auto;       /* allow horizontal scrolling */
  white-space: nowrap;    /* prevent wrapping */
  overflow-y: hidden;
}

.tx-hash-cell::-webkit-scrollbar {
  height: 4px;           /* horizontal scrollbar height */
}

.tx-hash-cell::-webkit-scrollbar-track {
  background: #f0f0f0;   /* track color */
  border-radius: 3px;
}

.tx-hash-cell::-webkit-scrollbar-thumb {
  background: #3f4144;   /* thumb color */
  border-radius: 3px;
}

.tx-hash-cell::-webkit-scrollbar-thumb:hover {
  background: #0059c9;   /* darker on hover */
}


/* Status Styles */
.status {
  padding: 5px 10px;
  border-radius: 8px;
  font-weight: 600;
  text-transform: capitalize;
}

.status.confirmed {
  background: #03580a;
  color: #ffffff;
}

.status.unconfirmed {
  background: #9c7800;
  color: #ffffff;
}

.status.pending {
  background: #fff3cd;
  color: #9c7800;
}

/* Type Styles */
.type-badge {
  padding: 5px 10px;
  border-radius: 8px;
  font-weight: 600;
  text-transform: capitalize;
}

.type-badge.receive {
  background: #08ef36;
  color: #0d0d0e;
}

.type-badge.send {
  background: #e00937;
  color: #000000;
}

/* Link Column */
.tx-link {
  font-size: 18px;
  text-decoration: none;
  color: #2b7cff;
  transition: 0.2s;
}

.tx-link:hover {
  transform: scale(1.3);
  color: #0059c9;
}
</style>
