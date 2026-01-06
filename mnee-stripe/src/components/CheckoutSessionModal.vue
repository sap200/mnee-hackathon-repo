<template>
  <div class="modal-overlay">
    <div class="modal">

      <div class="modal-header">
        <h3>Create Checkout Session</h3>
        <button class="close-btn" @click="$emit('close')">✖</button>
      </div>

      <form @submit.prevent="create">
        <div class="form-row">
          <label>Session Name:</label>
          <input v-model="sessionName" required />
        </div>

        <button class="save-btn" :disabled="isSubmitting" type="submit">
          {{ isSubmitting ? "Creating..." : "Create" }}
        </button>
      </form>

    </div>
  </div>
</template>

<script>
export default {
  name: "CheckoutSessionModal",

  data() {
    return {
      sessionName: "",
      isSubmitting: false
    };
  },

  methods: {
    async create() {
      this.isSubmitting = true;
      this.$emit("create-session", this.sessionName);
      this.isSubmitting = false;
    }
  }
};
</script>

<style scoped>
/* Same styling as Add / Edit modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  width: 400px;
  padding: 20px;
  border-radius: 10px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: red;
  color: white;
  border: none;
  padding: 5px 9px;
  border-radius: 5px;
  cursor: pointer;
}

.form-row {
  margin: 16px 0;
  display: flex;
  align-items: center;
}

.form-row label {
  width: 130px;
  font-weight: bold;
}

.form-row input {
  flex: 1;
  padding: 6px;
}

.save-btn {
  margin-top: 20px;
  width: 100%;
  padding: 10px;
  background: #0066cc;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
