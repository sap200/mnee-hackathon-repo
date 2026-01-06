<template>
  <transition name="fade">
    <div v-if="visible" class="modal-overlay">
      <div class="modal-container">
        <!-- Close Icon -->
        <button class="close-btn" @click="$emit('close')">✖</button>

        <div class="modal-header">
          <h3>Cancel Payment</h3>
        </div>

        <form @submit.prevent="submitCancel" class="modal-body">
          <label for="reason">Reason for cancellation:</label>
          <input
            id="reason"
            v-model="reason"
            type="text"
            placeholder="Enter reason"
            required
          />

          <div class="modal-footer">
            <button type="submit" class="cancel-btn">Cancel Payment</button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "CancelModal",
  props: {
    visible: { type: Boolean, required: true }
  },
  data() {
    return {
      reason: ""
    };
  },
  methods: {
    submitCancel() {
      if (!this.reason.trim()) {
        alert("Reason is required!");
        return;
      }
      // Emit the reason to the parent
      this.$emit("submit", { reason: this.reason });
      // Reset the input
      this.reason = "";
      // Close modal
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-container {
  background: #fff;
  border-radius: 16px;
  width: 400px;
  max-width: 90%;
  padding: 30px 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
}

/* Close Button */
.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  border: none;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
  color: #dc3545;
  transition: transform 0.2s;
}

.close-btn:hover {
  transform: scale(1.2);
}

/* Header */
.modal-header h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  text-align: center;
}

/* Body / Form */
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.modal-body label {
  font-weight: 600;
}

.modal-body input {
  padding: 10px;
  border-radius: 10px;
  border: 2px solid #ccc;
  font-size: 15px;
  outline: none;
  transition: border 0.2s;
}

.modal-body input:focus {
  border-color: #dc3545;
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: center;
}

.cancel-btn {
  padding: 12px 28px;
  border-radius: 10px;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  background: linear-gradient(135deg, #ff5555, #ff8888);
  color: white;
  box-shadow: 0px 4px 8px rgba(0,0,0,0.2);
  transition: transform 0.2s ease;
}

.cancel-btn:hover {
  transform: translateY(-3px);
}
</style>
