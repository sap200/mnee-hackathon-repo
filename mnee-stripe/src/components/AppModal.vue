<!-- AppModal.vue -->
<template>
  <div v-if="visible" class="modal-backdrop">
    <div class="modal">
      <!-- Red Cross Close Button -->
      <button class="close-btn" @click="$emit('close')">&times;</button>

      <h2>Create New App</h2>

      <form @submit.prevent="handleCreate">
        <!-- Name Field -->
        <div class="form-row">
          <label for="name">Name:</label>
          <input v-model="form.name" id="name" type="text" required />
        </div>

        <!-- Description Field -->
        <div class="form-row">
          <label for="description">Description:</label>
          <textarea v-model="form.description" id="description" required></textarea>
        </div>

        <!-- Webhook URL Field -->
        <div class="form-row">
          <label for="webhook">Webhook URL:</label>
          <input v-model="form.webhookURL" id="webhook" type="text" required/>
        </div>

        <div class="modal-actions">
          <button type="submit" class="btn">Create</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppModal",
  props: {
    visible: { type: Boolean, default: false },
  },
  data() {
    return {
      form: {
        name: "",
        description: "",
        webhookURL: "",
      },
      errors: {},
    };
  },
  methods: {
    handleCreate() {
      this.errors = {};

      // Validation
      if (!this.form.name.trim()) this.errors.name = "Name is required";
      if (!this.form.description.trim()) this.errors.description = "Description is required";
      if (!this.form.webhookURL.trim()) this.errors.webhookURL = "Webhook URL is required";

      if (Object.keys(this.errors).length > 0) return;

      // Emit creation event
      this.$emit("create", { ...this.form });

      // Reset form
      this.form = { name: "", description: "", webhookURL: "" };
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  padding: 24px 24px 16px 24px;
  border-radius: 12px;
  width: 450px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
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
  font-size: 18px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  line-height: 26px;
  text-align: center;
}

.close-btn:hover {
  background: #d9363e;
}

h2 {
  margin-bottom: 20px;
  text-align: center;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.form-row label {
  width: 120px; /* Fixed width for all labels */
  text-align: right;
  margin-right: 12px;
  font-weight: bold;
}

.form-row input,
.form-row textarea {
  flex: 1;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}

textarea {
  resize: vertical;
  min-height: 60px;
}

.error-msg {
  margin-left: 132px; /* align with input box */
  color: #ff4d4f;
  font-size: 13px;
  margin-bottom: 8px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  background-color: #0066cc;
  color: white;
}

.btn:hover {
  background-color: #004999;
}
</style>
