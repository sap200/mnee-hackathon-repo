<template>
  <div v-if="visible" class="modal-backdrop">
    <div class="modal">
      <!-- Close button -->
      <button class="close-btn" @click="$emit('close')">&times;</button>

      <h2>Create Subscription</h2>

      <form @submit.prevent="handleCreate">
        <div class="form-row">
          <label for="customerId">Customer ID:</label>
          <input
            id="customerId"
            v-model="customerId"
            type="text"
            placeholder="Enter Customer ID"
            required
          />
        </div>

        <div class="modal-actions">
          <button class="btn primary" type="submit">Create</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateSubscriptionModal",
  props: {
    visible: { type: Boolean, default: false },
    planId: { type: String, required: true },
  },
  data() {
    return {
      customerId: "",
    };
  },
  methods: {
    handleCreate() {
      const payload = {
        customerId: this.customerId,
        planId: this.planId,
      };
      console.log("Create subscription payload:", payload);
      this.$emit("create-subscription", payload);

      // Reset and close
      this.customerId = "";
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ff4d4f;
  border: none;
  border-radius: 50%;
  color: white;
  width: 28px;
  height: 28px;
  font-size: 18px;
  line-height: 26px;
  text-align: center;
  cursor: pointer;
}

.close-btn:hover {
  background: #d9363e;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.form-row label {
  width: 120px;
  font-weight: bold;
}

.form-row input {
  flex: 1;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: #0066cc;
  color: white;
}
</style>
