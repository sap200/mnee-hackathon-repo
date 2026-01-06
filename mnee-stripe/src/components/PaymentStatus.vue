<template>
  <div class="status-page">
    <div class="status-container">
      <!-- Animated Icon -->
      <div class="status-icon" :class="status">
        <template v-if="status === 'success'">
          ✔
        </template>
        <template v-else-if="status === 'pending'">
          ⚠
        </template>
        <template v-else-if="status === 'failed' || status === 'failure'">
          ✖
        </template>
        <template v-else-if="status === 'cancel' || status === 'cancelled'">
          ⨯
        </template>
        <template v-else>
          ❔
        </template>
      </div>

      <!-- Heading -->
      <h1 :class="statusClass">{{ heading }}</h1>

      <!-- Message -->
      <p class="status-message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "PaymentStatus",
  data() {
    return {
      status: "",
      heading: "",
      message: "",
      statusClass: "",
      email: ""
    };
  },
  mounted() {
    this.status = this.$route.params.myStatus.toLowerCase();
    this.email = this.$route.query.supportEmail;
    this.setStatusContent();
  },
  methods: {
    setStatusContent() {
      switch(this.status) {
        case "success":
          this.heading = "Payment Successful!";
          this.message = "Your payment has been completed successfully.";
          this.statusClass = "success";
          break;
        case "pending":
          this.heading = "Payment Pending";
          this.message = "Your payment is pending. Please wait...";
          this.statusClass = "pending";
          break;
        case "failed":
        case "failure":
          this.heading = "Payment Failed";
          this.message = `There was a discrepancy with your payment. Please contact us at ${this.email}.`;
          this.statusClass = "failed";
          break;
        case "cancel":
        case "cancelled":
          this.heading = "Payment Cancelled";
          this.message = "You have cancelled the payment. No charges were made.";
          this.statusClass = "cancel";
          break;
        default:
          this.heading = "Unknown Status";
          this.message = "Something went wrong. Please try again.";
          this.statusClass = "unknown";
      }
    }
  }
};
</script>

<style scoped>
/* Page background */
.status-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f3f4f7, #e1e5ee);
  font-family: 'Poppins', sans-serif;
}

/* Container */
.status-container {
  background: #fff;
  padding: 50px 40px;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0,0,0,0.2);
  text-align: center;
  max-width: 500px;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* Animated Icon */
.status-icon {
  font-size: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Success animation */
.status-icon.success {
  color: #28a745;
  animation: popSuccess 0.8s ease-out forwards;
}

/* Pending animation */
.status-icon.pending {
  color: #ffc107;
  animation: bouncePending 1s infinite;
}

/* Failed animation */
.status-icon.failed {
  color: #dc3545;
  animation: shakeFailed 0.6s ease-in-out infinite;
}

/* Cancel animation */
.status-icon.cancel {
  color: #007bff;
  animation: fadeIn 0.8s ease-out forwards;
}

/* Unknown animation */
.status-icon.unknown {
  color: #6c757d;
  animation: fadeIn 1s ease-in-out;
}

/* Heading */
h1 {
  font-size: 32px;
  margin: 0;
  font-weight: 700;
}

/* Status color */
.success { color: #28a745; }
.pending { color: #ffc107; }
.failed { color: #dc3545; }
.cancel { color: #007bff; }
.unknown { color: #6c757d; }

/* Message */
.status-message {
  font-size: 18px;
  color: #555;
  line-height: 1.6;
}

/* Animations */
@keyframes popSuccess {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); }
}

@keyframes bouncePending {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes shakeFailed {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
}

@keyframes fadeIn {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}
</style>
