<template>
  <div class="account-page">
    <h1>Merchant Details</h1>
    <hr>
    <button class="logout-btn" @click="logout"> ⏻ Logout </button>

    <!-- ID -->
    <div class="field">
      <label>Merchant ID:</label>
      <span>{{ account.id }}</span>
      <div></div>
    </div>

    <!-- Business Name -->
    <div class="field">
      <label>Business Name:</label>
      <span>{{ account.businessName }}</span>
      <div></div>
    </div>

    <!-- Email -->
    <div class="field">
      <label>Email:</label>
      <span>{{ account.email }}</span>
      <div></div>
    </div>

    <!-- Wallet Address -->
    <div class="field">
      <label>Wallet Address:</label>
      <input
        v-if="editing.walletAddress"
        v-model="account.walletAddress"
      />
      <span v-else>{{ account.walletAddress }}</span>
      <button class="edit-btn" @click="toggleEdit('walletAddress')">
        {{ editing.walletAddress ? '💾 Save' : '✏️ Edit' }}
      </button>
    </div>

    <!-- Success Webhook URL -->
    <div class="field">
      <label>Success Webhook URL:</label>
      <input
        v-if="editing.successWebhookURL"
        v-model="account.successWebhookURL"
      />
      <span v-else>{{ account.successWebhookURL }}</span>
      <button class="edit-btn" @click="toggleEdit('successWebhookURL')">
        {{ editing.successWebhookURL ? '💾 Save' : '✏️ Edit' }}
      </button>
    </div>

    <!-- Failure Webhook URL -->
    <div class="field">
      <label>Failure Webhook URL:</label>
      <input
        v-if="editing.failureWebhookURL"
        v-model="account.failureWebhookURL"
      />
      <span v-else>{{ account.failureWebhookURL }}</span>
      <button class="edit-btn" @click="toggleEdit('failureWebhookURL')">
        {{ editing.failureWebhookURL ? '💾 Save' : '✏️ Edit' }}
      </button>
    </div>

    <!-- cancel Webhook URL -->
    <div class="field">
      <label>Cancel Webhook URL:</label>
      <input
        v-if="editing.cancelWebhookURL"
        v-model="account.cancelWebhookURL"
      />
      <span v-else>{{ account.cancelWebhookURL }}</span>
      <button class="edit-btn" @click="toggleEdit('cancelWebhookURL')">
        {{ editing.cancelWebhookURL ? '💾 Save' : '✏️ Edit' }}
      </button>
    </div>

    <!-- cancel Webhook URL -->

    <div class="field">
      <label>Pending Webhook URL:</label>
      <input
        v-if="editing.pendingWebhookURL"
        v-model="account.pendingWebhookURL"
      />
      <span v-else>{{ account.pendingWebhookURL }}</span>
      <button class="edit-btn" @click="toggleEdit('pendingWebhookURL')">
        {{ editing.pendingWebhookURL ? '💾 Save' : '✏️ Edit' }}
      </button>
    </div>

    <!-- API Key -->
    <div class="field">
      <label>API Key:</label>
      <span>{{ account.apiKey }}</span>
      <button class="regen-btn" @click="regenerateApiKey">
        🔄Regenerate
      </button>
    </div>

    <!-- Created At -->
    <div class="field">
      <label>Created At:</label>
      <span>{{ formatDate(account.createdAt) }}</span>
      <div></div>
    </div>

    <!-- Created At -->
    <div class="field">
      <label>Last Modified At:</label>
      <span>{{ formatDate(account.updatedAt) }}</span>
      <div></div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import { HOST_URL, LOGIN_MICRO_URL } from '@/constants.js';

export default {
  name: 'AccountPage',
  data() {
    return {
      account: {
        id: '',
        businessName: '',
        email: '',
        walletAddress: '',
        successWebhookURL: '',
        failureWebhookURL: '',
        cancelWebhookURL: '',
        pendingWebhookURL: '',
        apiKey: '',
        createdAt: '',
        updatedAt: ''
      },
      editing: {
        walletAddress: false,
        successWebhookURL: false,
        failureWebhookURL: false,
        cancelWebhookURL: false,
      }
    }
  },
  methods: {
    async fetchAccount(email) {
        try {
            const response = await axios.get(`${HOST_URL}/merchant/${email}`)
            this.account = response.data.merchant
            localStorage.setItem("merchantId", this.account.id);
            localStorage.setItem("merchantApiKey", this.account.apiKey);
            localStorage.setItem("walletAddress", this.account.walletAddress);
        } catch(error) {
            console.log(error)
        }
    },
    async toggleEdit(field) {
        
      if(this.editing[field]) {
          await this.updateField(field);
      }
      this.editing[field] = !this.editing[field]

    },
    async updateField(field) {
      // call API here if needed      
      console.log(field)
      try {
        const merchantId = localStorage.getItem('merchantId');

        if(field == 'successWebhookURL') {
            const response = await axios.post(`${HOST_URL}/merchant/${merchantId}/update-success-webhook`, {'successWebhookURL': this.account.successWebhookURL});
            this.account = response.data.merchant;
        } else if (field == 'failureWebhookURL') {
            const response = await axios.post(`${HOST_URL}/merchant/${merchantId}/update-failure-webhook`, {'failureWebhookURL': this.account.failureWebhookURL});
            this.account = response.data.merchant;
        } else if (field == 'walletAddress') {
            console.log(this.account.walletAddress);
            const response = await axios.post(`${HOST_URL}/merchant/${merchantId}/update-wallet-address`, {'walletAddress': this.account.walletAddress});
            this.account = response.data.merchant;
            console.log("Updated !")
        } else if (field == 'cancelWebhookURL') {
            const response = await axios.post(`${HOST_URL}/merchant/${merchantId}/update-cancel-webhook`, {'cancelWebhookURL': this.account.cancelWebhookURL});
            this.account = response.data.merchant;
        } else if (field == 'pendingWebhookURL') {
            const response = await axios.post(`${HOST_URL}/merchant/${merchantId}/update-pending-webhook`, {'pendingWebhookURL': this.account.pendingWebhookURL});
            this.account = response.data.merchant;
        }
      } catch(error) {
          console.log(error)
      } finally {
          this.fetchAccount(localStorage.getItem('userEmail'))
      }
    },
    async regenerateApiKey() {
      // call API to regenerate key
      try {
        const merchantId = localStorage.getItem('merchantId');
        await axios.post(`${HOST_URL}/merchant/${merchantId}/regenerate-api-key`);
      } catch(error) {
        console.log(error);
      } finally {
          await this.fetchAccount(localStorage.getItem('userEmail'));
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString()
    },
    getEmailFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('email'); // ?email=example@domain.com
    },

    async logout() {
        console.log("logging out...")
        try {
            const data = {
                token: localStorage.getItem('token')
            }
            await axios.post(`${HOST_URL}/merchant/logout`, data)
            console.log("Here")
            localStorage.clear();
            window.location.replace(LOGIN_MICRO_URL);
        } catch(error) {
            console.log("Here");
            console.log(error);
            localStorage.clear();
            window.location.replace(LOGIN_MICRO_URL);

        }
    }
  },
  async mounted() {
    var email = this.getEmailFromURL();
    if(!email) {
        email = localStorage.getItem('userEmail');
    }
    if (email) {
      localStorage.setItem('userEmail', email);
      this.fetchAccount(email);
    } else {
      console.warn('Email not found in URL');
      await this.logout();
      window.location.replace(LOGIN_MICRO_URL);


    }  
  }
}
</script>

<style scoped>
.account-page {
  margin: 0 auto;
  font-family: 'Lucida Fax', serif;
  max-width: 70%;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

hr {
  margin-bottom: 20px;
  border: none;
  height: 1px;
  background-color: #ccc;
}

/* Table-like layout: label | value | button */
.field {
  display: grid;
  grid-template-columns: 200px 1fr 150px; /* label | value | button */
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

label {
  font-weight: bold;
  text-align: right;
}

input, span {
  width: 100%;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  color: darkblue;
  background-color: #fff;
  font-size: 14px;
}

input:focus {
  border-color: #8b5c2c;
  outline: none;
  box-shadow: 0 0 5px rgba(139,92,44,0.4);
}

/* Buttons */
button {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  color: #fff;
}

/* Edit button gradient */
button.edit-btn {
  background: linear-gradient(135deg, #2b7cff, #3daeff);
}

/* Regenerate button gradient */
button.regen-btn {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
}

button:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

button:active {
  transform: scale(0.98);
}

.logout-btn {
  display: block;
  margin: 0 0 20px auto; /* push to right */
  background: linear-gradient(135deg, #ff4d4d, #ff0000);
}

.logout-btn:hover {
  opacity: 0.9;
}

</style>
