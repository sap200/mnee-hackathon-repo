<!-- eslint-disable -->
<template>
  <div class="page-wrapper">
    <div class="checkout-container" v-if="sessionStatus === 'CREATED'">

      <h3 class="title">Review & Pay</h3> <hr>

      <!-- PRODUCT GRID -->
      <div class="product-grid">
        <div
          v-for="(item, index) in availableItems"
          :key="index"
          class="product-card"
        >
          <img :src="item.imageURL" class="product-image" />

          <div class="product-info">
            <h3 class="product-name">{{ item.name }}</h3>

            <p class="product-price">
              Qty {{ item.quantity }} × {{ item.unitPrice }} {{ currency }}
            </p>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <!-- TOTAL -->
      <div class="total-container">
        <div class="total-box">
          Total: {{ totalAmount }} {{ currency }}
        </div>
      </div>

      <!-- PRIVATE KEY INPUT -->
      <div class="input-row">
        <label class="input-label">Private WIF Key:</label>
        <input
          v-model="privateKey"
          type="password"
          placeholder="Enter your private key"
          class="input-field"
        />
      </div>

      <!-- ACTION BUTTONS -->
      <div class="button-row">
        <button class="pay-btn" @click="pay">Pay</button>
        <button class="cancel-btn" @click="showCancelModal=true">Cancel</button>
      </div>
    </div>

    <PaymentModal
        :visible="showPaymentModal"
        title="Processing Payment"
        message="Please wait until the payment is completed. Do not close or refresh the page."
    />

    <CancelModal :visible="showCancelModal" @close="showCancelModal = false"  @submit="handleCancel"/>

  </div>
</template>

<script>
import { useToast } from "vue-toastification";
import { HOST_URL, MNEE_HOST_URL} from '@/constants.js';
import axios from 'axios';
import PaymentModal from "@/components/PaymentModal.vue";
import CancelModal from "@/components/CancelModal.vue";



export default {
  name: "HostedPage",
  components: {
      PaymentModal,
      CancelModal 
  },
  data() {
    return {
      // Hardcoded Webhooks
      checkoutSession: null,
      productsFetched: {},
      sessionStatus: "",
      currency: "",
      totalAmount: 0,
      availableItems: [],
      privateKey: "",
      showPaymentModal: false,
      showCancelModal: false,
    };
  },

  async mounted() {
    // Simulated session
    // mnee.config().then(mneeConfig => {
    // console.log('MNEE Configuration:', mneeConfig);
    // });
    const id = this.$route.params.id
    await this.getCheckoutSessionById(id);
  },

  methods: {
    async fetchProduct(productId) {
        console.log(productId)
        try {
            const response = await axios.get(`${HOST_URL}/product/${productId}/get-product`);
            if(response.data.status == 'success') {
                return response.data.product;
            } else {
                console.log(response.data.errorMessage);
            }

        } catch(error) {
            console.log(error);
        }
      
    },

    async getCheckoutSessionById(id) {
        const toast = useToast();

        try {
            const response = await axios.get(`${HOST_URL}/checkout-session/${id}/get`);
            if(response.data.status == 'success') {
                this.checkoutSession = response.data.checkoutSession
                
                this.sessionStatus = this.checkoutSession.status;

                // Redirect logic
                if (this.sessionStatus === "PAID") {
                    window.location.href = this.checkoutSession.successURL;
                    return;
                }

                if (this.sessionStatus === "CANCELLED") {
                    window.location.href = this.checkoutSession.cancelURL;
                    return;
                }

                
                if (this.sessionStatus === "FAILED") {
                    window.location.href = this.checkoutSession.failureURL;
                    return;
                }

                // Load if created
                if (this.sessionStatus === "CREATED") {
                    this.currency = this.checkoutSession.currency;
                    this.totalAmount = this.checkoutSession.totalAmount;
                    await this.loadProducts();
                }

            } else {
                toast.error(response.data.errorMessage);
                console.log(response.data.errorMessage);
            }

        } catch(error) {
            toast.error("Unable to fetch checkout session");
            console.log(error);
        }

    },

    async loadProducts() {
      const items = this.checkoutSession.itemList.filter(
        (i) => i.status === "AVAILABLE"
      );

      const list = [];

      for (let item of items) {
        if (!this.productsFetched[item.productObjectId]) {
          const p = await this.fetchProduct(item.productObjectId);
          this.productsFetched[item.productObjectId] = p;
        }

        list.push({
          ...this.productsFetched[item.productObjectId],
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        });
      }

      console.log(list);

      this.availableItems = list;
    },

    async pay() {
        // get the merchant by Id.
        const toast = useToast();
        try {
            const recipient = this.checkoutSession.merchantWalletAddress;
            const amount = this.totalAmount;
            const wif = this.privateKey.trim();
            if(wif == null || wif == "") {
                toast.warning("Wif is empty !");
                return;
            }

            // Prepare the transfer request
            const request = {
                 wif: wif,
                 recipientAddress: recipient,
                 amount: amount
                }

            console.log(request);
            
            this.showPaymentModal = true;
            const responseMNEE = await axios.post(`${MNEE_HOST_URL}/api/mnee/mnee-transfer`, request);
            // once received send to spring boot the entire object will be processed there, and status will be updated.
            const springPayload = {
                ticketId: responseMNEE.data.ticketId,
                detailsMap: responseMNEE.data.details
            }

            console.log("spring payload");
            console.log(springPayload);

            const response = await axios.post(`${HOST_URL}/checkout-session/${this.checkoutSession.id}/update-details-map`, springPayload);
            // then do here like if success success or if failure, failure page redirection. 
            if(response.data.status == 'success') {
                if(response.data.checkoutSession.status == 'PAID') {
                    console.log('SUCCESS');
                    window.location.replace(response.data.checkoutSession.successURL);

                } else if (response.data.checkoutSession.status == 'FAILED') {
                    console.log('FAILED');
                    window.location.replace(response.data.checkoutSession.failureURL);
                } else if (response.data.checkoutSession.status == 'PENDING') {
                    console.log('PENDING');
                    // redirect to pending URL
                    window.location.replace(response.data.checkoutSession.pendingURL);
                }
            } else {
                console.log(responseMNEE)
                console.log(response);
                window.location.replace(response.data.checkoutSession.failureURL);
            }

        } catch(error) {
            console.log(error);
            toast.error("Payment failed: " + JSON.stringify(error.response.data));
            // redirect to failure
            this.showPaymentModal = false;
        }
    },

    async handleCancel(data) {
        const r = data.reason;
        console.log(r);
        const toast = useToast();
        const payload = {
            reason: r,
        }

        try {
            const response = await axios.post(`${HOST_URL}/checkout-session/${this.checkoutSession.id}/cancel-checkout`, payload);
            if(response.data.status == 'success') {
                window.location.replace(response.data.checkoutSession.cancelURL);
            } else {
                console.log(response.data.errorMessage);
                toast.error(response.data.errorMessage)
            }

        } catch(error) {
            console.log(error);
            toast.error(error);
        }
    },
    
  },
};
</script>

<style scoped>

/* PAGE BACKDROP */
.page-wrapper {
  background: #f3f4f7;
  min-height: 100vh;
  padding: 40px 0;
  display: flex;
  justify-content: center;
}

/* MAIN CONTAINER */
.checkout-container {
  width: 95%;
  max-width: 1100px;
  padding: 30px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0px 8px 16px rgba(0,0,0,0.15);
}

/* TITLE */
.title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
  font-weight: 700;
}

/* PRODUCT GRID */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 22px;
}

/* PRODUCT CARD */
.product-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0px 6px 12px rgba(0,0,0,0.12);
  transition: transform 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
}

.product-image {
  width: 100%;
  height: 110px;
  object-fit: cover;
  border-bottom: 1px solid #eaeaea;
}

.product-info {
  padding: 12px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
}

.product-price {
  margin-top: 6px;
  font-size: 13px;
  color: #555;
}

/* DIVIDER */
.divider {
  margin: 35px 0;
  height: 2px;
  background: #ddd;
}

/* TOTAL */
.total-container {
  display: flex;
  justify-content: flex-end;
}

.total-box {
  padding: 14px 22px;
  border-radius: 10px;
  background: #f7f8fa;
  font-size: 18px;
  font-weight: bold;
  box-shadow: inset 0 0 4px rgba(0,0,0,0.08);
}

/* INPUT */
.input-row {
  margin-top: 30px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.input-label {
  font-weight: 600;
}

.input-field {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: 2px solid #ccc;
  outline: none;
  font-size: 15px;
  transition: border 0.2s ease;
}

.input-field:focus {
  border-color: #7a5cff;
}

/* BUTTONS */
.button-row {
  margin-top: 40px;
  display: flex;
  gap: 20px;
  justify-content: center;
}

.pay-btn {
  padding: 12px 28px;
  border-radius: 10px;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  background: linear-gradient(135deg, #6a5cff, #8a7dff);
  color: white;
  box-shadow: 0px 4px 8px rgba(0,0,0,0.2);
  transition: transform 0.2s ease;
}

.pay-btn:hover {
  transform: translateY(-3px);
}

.cancel-btn {
  padding: 12px 28px;
  border-radius: 10px;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  background: linear-gradient(135deg, #ff6655, #ff8a7a);
  color: white;
  box-shadow: 0px 4px 8px rgba(0,0,0,0.2);
}

.cancel-btn:hover {
  transform: translateY(-3px);
}
</style>
