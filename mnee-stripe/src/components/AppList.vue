<!-- AppList.vue -->
<template>
  <div class="app-page">
    <!-- Header -->
    <header class="header">
      <h1>App List</h1> 
      <button class="primary-btn" @click="appModalVisible=true">➕ Add an App</button>
    </header><hr>

    <!-- Table -->
    <div class="table-wrapper">
      <table class="app-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Merchant ID</th>
            <th>App ID</th>
            <th>App Key</th>
            <th>Webhook URL</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="app in apps" :key="app.id">
            <td>{{ app.name }}</td>
            <td>{{ app.merchantId }}</td>
            <td> {{app.id}}</td>
            <td>
              <div class="txn-cell">{{ app.appKey }}</div>
            </td>
            <td>{{ app.webhookURL }}</td>
            <td>{{ formatDate(app.createdAt) }}</td>
            <td>{{ formatDate(app.updatedAt)}} </td>
            <td>
              <a
                class="action-link"
                :href="`/app-details/${app.id}/${app.appKey}`"
                rel="noopener"
              >
                View
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <AppModal
        :visible="appModalVisible"
        @close="appModalVisible = false"
        @create="handleAdd"
    />
  </div>
</template>

<script>
import axios from 'axios';
import { HOST_URL } from '@/constants.js';
import { useToast } from "vue-toastification";
import AppModal from './AppModal.vue';


export default {
  name: "AppList",
  components: {
      AppModal
  },
  data() {
    return {
      buttonClicked: false,
      selectedApp: null,
      appModalVisible: false,
      apps: []
    };
  },
  methods: {
    async fetchAppDetails() {
        const merchantId = localStorage.getItem('merchantId');
        const toast = useToast();
        try {
            const response = await axios.get(`${HOST_URL}/subscription/${merchantId}/get-all-app`);
            this.apps = response.data;
        } catch(error) {
            toast.error("Error occured while fetching app details.")
            console.log(error);
        }

    },

    async handleAdd(newApp) {
      console.log("Add an App button clicked");
      console.log(newApp);
      const toast = useToast();
      const merchantId = localStorage.getItem('merchantId');
      newApp.merchantId = merchantId;

      try {
          const response = await axios.post(`${HOST_URL}/subscription/create-app`, newApp);
          await this.fetchAppDetails();
          if(response.data.status == "success") {
            toast.success("App added")
          }

      } catch(error) {
          toast.error("Error occured while creating an app.")
          console.log(error)
      } finally {
          this.appModalVisible = false;
      }
    },

    selectApp(app) {
      this.selectedApp = app;
    },
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
    }
  },

  async mounted() {
      await this.fetchAppDetails();
  }
};
</script>

<style scoped>
.app-page {
  padding: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

h1 {
  font-size: 24px;
}

.primary-btn {
  background-color: #338ae2;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.primary-btn:hover {
  background-color: #004999;
}

.table-wrapper {
  overflow-x: auto;
}

.app-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.app-table th,
.app-table td {
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
}

.app-table th {
  background-color: #f4f4f9;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
}

.app-table tbody tr {
  transition: background 0.2s;
}

.app-table tbody tr:hover {
  background-color: #f9f9f9;
}

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

.txn-cell::-webkit-scrollbar {
  height: 5px;
}

.txn-cell::-webkit-scrollbar-thumb {
  background-color: rgb(204, 204, 204);
  border-radius: 2px;
}

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
