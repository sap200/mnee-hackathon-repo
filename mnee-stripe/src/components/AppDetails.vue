<template>
  <div class="page-container">
    <div class="page-card">
        <!-- PAGE HEADER -->
        <div class="page-header">
        <div class="header-content">
            <h1>App Details</h1>
            <p class="app-id">App ID: {{ appId }}</p>
        </div>

        <button class="close-page-btn" @click="goBack">
            &times;
        </button>
        </div> <hr>

        <!-- SECTION A: APP DETAILS -->
        <div class="card">
        <div class="card-header">
            <h2>App Settings</h2>
            <button class="btn" @click="toggleEditApp">
            {{ isEditingApp ? "Save" : "Edit" }}
            </button>
        </div>

        <div class="form-row">
            <label>Name:</label>
            <input v-model="app.name" :disabled="!isEditingApp" />
        </div>

        <div class="form-row">
            <label>Description:</label>
            <input v-model="app.description" :disabled="!isEditingApp" />
        </div>

        <div class="form-row">
            <label>Webhook URL:</label>
            <input v-model="app.webhookURL" :disabled="!isEditingApp" />
        </div>
        </div>

        <!-- SECTION B: PLANS -->
        <div class="card">
        <div class="card-header">
            <h2>Plans</h2>
            <button class="btn primary" @click="showAddPlanModal=true">
            + Add Plan
            </button>
        </div>

        <table class="plans-table">
            <thead>
            <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Amount</th>
                <th>Interval</th>
                <th>Status</th>
                <th>Edit</th>
                <th>Subscribe</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="plan in plans" :key="plan.id">
                <td>{{ plan.name }}</td>
                <td>{{ plan.code }}</td>
                <td>{{ plan.amount }} {{ plan.currency }}</td>
                <td>{{ plan.interval }}</td>
                <td>{{ plan.status }}</td>
                <td>
                <button class="btn small" @click="editPlan(plan)">
                    Edit Plan
                </button>
                </td>
                <td>
                <button
                    v-if="plan.status=='ACTIVE'"
                    class="btn small success"
                    @click="createSubscription(plan)"
                >
                    Create Subscription
                </button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>

    
    <AddPlanModal
    :visible="showAddPlanModal"
    @close="showAddPlanModal = false"
    @create-plan="handleNewPlan"
    />

    <EditPlanModal
        :visible="showEditPlanModal"
        :plan="selectedPlan"
        @close="showEditPlanModal = false"
        @update-plan="handleUpdatePlan"
    />

    <CreateSubscriptionModal
        :visible="showCreateSubscriptionModal"
        :planId="selectedPlanId"
        @close="showCreateSubscriptionModal = false"
        @create-subscription="handleCreateSubscription"
    />


  </div>
</template>

<script>
import axios from 'axios';
import { HOST_URL } from '@/constants.js';
import { useToast } from "vue-toastification";
import AddPlanModal from "./AddPlanModal.vue";
import EditPlanModal from "./EditPlanModal.vue";
import CreateSubscriptionModal from "./CreateSubscriptionModal.vue";



export default {
  name: "AppDetails",
  components: {
      AddPlanModal,
      EditPlanModal,
      CreateSubscriptionModal,
  },

  data() {
    return {
      appId: null,
      isEditingApp: false,
      selectedPlan: {},
      showAddPlanModal: false,
      showEditPlanModal: false,
      showCreateSubscriptionModal: false,
      selectedPlanId: null,
      app: {},
      plans: [],
    };
  },

  async mounted() {
    this.appId = this.$route.params.appId;
    await this.fetchPlans();
    await this.fetchAppDetails();
    console.log("Mounted AppDetails page for appId:", this.appId);
  },

  methods: {
    async fetchPlans() {
        const { appId, appKey } = this.$route.params;
        console.log(appId, appKey)
        const toast = useToast();
        try {
            const response = await axios.get(`${HOST_URL}/subscription/${appKey}/get-all-plan-by-app-key`)
            this.plans = response.data;
        } catch(error) {
            toast.error("Error fetching plans");
            console.log(error)
        }
    },

    async fetchAppDetails() {
        const { appId, appKey } = this.$route.params;
        console.log(appId, appKey)
        const toast = useToast();
        try {
            const response = await axios.get(`${HOST_URL}/subscription/${appId}/get-app`)
            if(response.data.status == 'success') {
                this.app = response.data.app;
            } else {
                toast.error(response.data.errorMessage)
                console.log(response.data);
            }
        } catch(error) {
            toast.error("Error fetching app details");
            console.log(error)
        }
    },

    goBack() {
      this.$router.back();
    },

    async toggleEditApp() {
      const toast = useToast();
      if (this.isEditingApp) {
        console.log("Updated app object:", this.app);
        const { appId, appKey } = this.$route.params;
        console.log(appId, appKey);
        try {
            const response = await axios.post(`${HOST_URL}/subscription/${appId}/update-app`, this.app);
            if(response.data.status == 'success') {
                toast.success("App edited successfully");
                this.app = response.data.app;
            } else {
                toast.error(response.data.errorMessage);
            }
        } catch(error) {
            toast.error("Error editing app details");
            console.log(error);
        }

      }
      this.isEditingApp = !this.isEditingApp;
    },

    addPlan() {
      console.log("add plan clicked");
    },

    editPlan(plan) {
      this.selectedPlan = { ...plan }; // pass a copy
      this.showEditPlanModal = true;
    },

    async handleUpdatePlan(plan) {
        console.log(plan);
        const toast = useToast();
        const { appId, appKey } = this.$route.params;
        console.log(appId, appKey);
        const _id = plan.id;
        delete plan.id;
        try {
            const response = await axios.post(`${HOST_URL}/subscription/${_id}/update-plan`, plan);
            if(response.data.status == 'success') {
                this.fetchPlans();
            } else {
                toast.error(response.data.errorMessage);
                console.log(response.data);
            }

        } catch(error) {
            toast.error("Error updating the plan !");
            console.log(error)
        } finally {
            this.showEditPlanModal = false;
        }


    },

    createSubscription(plan) {
      console.log("create subscription clicked for plan:", plan);
      this.selectedPlanId = plan.id;
      this.showCreateSubscriptionModal = true;
    },

    async handleCreateSubscription(payload) {
      console.log("Subscription payload received in parent:", payload);
      // Call your API here to create subscription if needed
      const toast = useToast();
      const { appId, appKey } = this.$route.params;
      console.log("New Sub data Data:", appId, appKey);      
      try {
          const response = await axios.post(`${HOST_URL}/subscription/create-customer-subscription`, payload);
          if(response.data.status == 'success') {
            toast.success("subscription created");
          } else {
              toast.error(response.data.errorMessage);
              console.log(response.data)
          }
      } catch(error) {
          toast.error("Failed to create subscription");
          console.log(error);
      } finally {
          this.showCreateSubscriptionModal = false;
      }
    },

    async handleNewPlan(newPlan) {
      const { appId, appKey } = this.$route.params;
      console.log("New Plan Data:", newPlan, appId, appKey);
      const toast = useToast();

      try {
          newPlan.appId = appId;
          const response = await axios.post(`${HOST_URL}/subscription/create-plan`, newPlan);
          if(response.data.status == 'success') {
              toast.success("Plan added successfully");
              await this.fetchPlans();
          } else {
              toast.error("Failure in adding the plan");
              console.log(response.data);
          }
      } catch(error) {
          toast.error("Unable to create a new plan!");
          console.log(error);
      } finally {
          this.showAddPlanModal =false;
      }

    },
  },

};
</script>

<style scoped>
.page-container {
  max-width: 1100px;
  margin: 30px auto;
  padding: 0 16px;
}

.page-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 20px 0;
}


.header-content {
  flex: 1;              /* 🔥 takes remaining space */
  text-align: center;   /* 🔥 centers title + app id */
}

/* HEADER */
.page-header {
 display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.app-id {
  color: #666;
  font-size: 14px;
  margin-top: 4px;
}

/* CLOSE BUTTON */
.close-page-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #ff4d4f;
  color: white;
  font-size: 22px;
  cursor: pointer;
  line-height: 34px;
  text-align: center;
}

.close-page-btn:hover {
  background: #d9363e;
}

/* CARD */
.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

/* FORM */
.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.form-row label {
  width: 140px;
  font-weight: 600;
}

.form-row input {
  flex: 1;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

/* TABLE */
.plans-table {
  width: 100%;
  border-collapse: collapse;
}

.plans-table th,
.plans-table td {
  padding: 10px;
  border-bottom: 1px solid #eee;
  text-align: left;
}

.plans-table th {
  background: #f8f9fb;
}

/* BUTTONS */
.btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: #ddd;
}

.btn.primary {
  background: #0066cc;
  color: white;
}

.btn.success {
  background: #28a745;
  color: white;
}

.btn.small {
  font-size: 13px;
}
</style>
