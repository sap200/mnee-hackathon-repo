<template>
  <transition name="fade">
    <div v-if="visible" class="modal-overlay">
      <div class="modal-container">
        <!-- Header -->
        <div class="modal-header">
          <h3>{{ title }}</h3>
        </div>

        <!-- Spinner -->
        <div class="spinner-container">
          <div class="spinner"></div>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <slot>
            <p>{{ message }}</p>
          </slot>
        </div>

        <!-- Footer -->
        <div class="modal-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "PaymentModal",
  props: {
    visible: { type: Boolean, required: true },
    title: { type: String, default: "Processing Payment" },
    message: { type: String, default: "Please do not quit the page. Wait until the payment is completed." }
  }
};
</script>

<style scoped>
/* Fade transition */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Overlay */
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 9999;
}

/* Modal container */
.modal-container {
  background: #fff;
  border-radius: 16px;
  width: 400px; max-width: 90%;
  padding: 25px 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  display: flex; flex-direction: column;
  gap: 15px;
  align-items: center;
  text-align: center;
}

/* Header */
.modal-header h3 { margin: 0; font-size: 20px; font-weight: 700; }

/* Spinner */
.spinner-container {
  margin: 20px 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 6px solid #f3f3f3;
  border-top: 6px solid #6a5cff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Body */
.modal-body p { font-size: 16px; color: #333; line-height: 1.5; }

/* Footer */
.modal-footer { display: flex; justify-content: center; gap: 10px; }
</style>
