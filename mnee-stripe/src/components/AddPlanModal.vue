<template>
  <div v-if="visible" class="modal-backdrop">
    <div class="modal">
      <!-- Close Button -->
      <button class="close-btn" @click="$emit('close')">&times;</button>

      <h2>Add New Plan</h2>

      <form @submit.prevent="handleCreate">
        <div class="form-row">
          <label for="name">Name:</label>
          <input id="name" v-model="form.name" type="text" required />
        </div>

        <div class="form-row">
          <label for="code">Code:</label>
          <input id="code" v-model="form.code" type="text" required />
        </div>

        <div class="form-row">
          <label for="amount">Amount:</label>
          <input
            id="amount"
            v-model.number="form.amount"
            type="number"
            step="0.01"
            required
          />
          <span class="currency">MNEE</span>
        </div>

        <div class="form-row">
          <label for="interval">Interval:</label>
          <select id="interval" v-model="form.interval" required>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <!-- FEATURES -->
        <div class="form-row features-row">
          <label>Features:</label><br>
          <div class="features-list">
            <div
              v-for="(feature, index) in form.features"
              :key="index"
              class="feature-input"
            >
              <input
                v-model="form.features[index]"
                type="text"
                required
                placeholder="Feature description"
              />
              <button
                type="button"
                class="btn small danger"
                @click="removeFeature(index)"
                v-if="form.features.length > 1"
              >
                -
              </button>
            </div>
            <button
              type="button"
              class="btn small primary"
              @click="addFeature"
            >
              + Add Feature
            </button>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn primary" type="submit">Create Plan</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddPlanModal",
  props: {
    visible: { type: Boolean, default: false },
  },
  data() {
    return {
      form: {
        name: "",
        code: "",
        amount: null,
        interval: "monthly",
        features: [""], // start with 1 feature
      },
    };
  },
  methods: {
    addFeature() {
      this.form.features.push("");
    },
    removeFeature(index) {
      if (this.form.features.length > 1) {
        this.form.features.splice(index, 1);
      }
    },
    handleCreate() {
      // Ensure at least 1 feature is filled
      const validFeatures = this.form.features.filter(f => f.trim() !== "");
      if (validFeatures.length === 0) {
        alert("Please add at least 1 feature");
        return;
      }

      this.$emit("create-plan", { ...this.form, features: validFeatures });

      // Reset form
      this.form = {
        name: "",
        code: "",
        amount: null,
        interval: "monthly",
        features: [""],
      };
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
  width: 450px;
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

form {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.form-row label {
  width: 120px;
  font-weight: bold;
}

.form-row input,
.form-row select {
  flex: 1;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.currency {
  margin-left: 8px;
  font-weight: bold;
}

.features-row {
  flex-direction: column;
  align-items: flex-start;
}

.features-list {
  width: 100%;
}

.feature-input {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.feature-input input {
  flex: 1;
  margin-right: 6px;
}

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

.btn.small {
  font-size: 13px;
  padding: 3px 8px;
}

.btn.danger {
  background: #ff4d4f;
  color: white;
  margin-left: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
