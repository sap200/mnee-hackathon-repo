<template>
  <div class="product-page">

    <!-- TOP BAR -->
    <div class="header-row">
      <h1>Products</h1>

      <div class="btn-group">
        <button class="checkout-btn"
          :disabled="!isCheckoutEnabled"
          @click="checkoutModal = true"
        >
          🧷 Create Checkout Session
        </button>

        <button class="add-btn" @click="showModal = true">
          ➕ Add Product
        </button>

        <button @click="showCsvModal = true" class="import-btn">📥 Import Prestashop Products</button>

      </div>
    </div>

    <hr />

    <!-- PRODUCT LIST -->
    <div class="product-list">
      <ProductCard
        v-for="p in products"
        :key="p.id"
        :product="p"
        :ref="'card-' + p.id"
        @update-cart="updateCart"
        @delete-product="deleteProduct"
        @edit-product="openEditModal(p)"
      />
    </div>

    <AddProductModal
      v-if="showModal"
      @close="showModal = false"
      @save='createProduct'
    />

    <EditProductModal
        v-if="editProductModal"
        :product="selectedProduct"
        @close="editProductModal = false"
        @update="saveProductChanges"
    />

    <CheckoutSessionModal
        v-if="checkoutModal"
        @close="checkoutModal = false"
        @create-session="checkoutSession"
    />

    <CsvUploadModal 
      :visible="showCsvModal"
      @close="showCsvModal = false"
      @csv-loaded="handleCsvData"
    />



  </div>
</template>

<script>
import ProductCard from "./ProductCard.vue";
import axios from 'axios';
import { HOST_URL, MNEE_STRIPE_DASHBOARD } from '@/constants.js';
import AddProductModal from "./AddProductModal.vue";
import EditProductModal from "./EditProductModal.vue";
import { useToast } from "vue-toastification";
import CheckoutSessionModal from "./CheckoutSessionModal.vue";
import CsvUploadModal from './CsvUploadModal.vue';




export default {
  name: "ProductPage",

  components: {
    ProductCard,
    AddProductModal,
    EditProductModal,
    CheckoutSessionModal,
    CsvUploadModal
  },

  data() {
    return {
      products: [],
      showModal: false,
      editProductModal: false,
      showCsvModal: false,
      checkoutModal: false,
      selectedProduct: null,
      cart: {} // { productId: quantity }
    };
  },

  computed: {
    isCheckoutEnabled() {
      return Object.values(this.cart).some(q => q > 0);
    }
  },

  methods: {
    async fetchAllProductsByMerchantId() {
        const merchantId = localStorage.getItem('merchantId');
        try {
            if(merchantId) {
                const response = await axios.get(`${HOST_URL}/product/${merchantId}/get-all-product-by-merchantid`)
                this.products = response.data;
            }
        } catch(error) {
            console.log(error)
        }
    },

    async createProduct(productRequest) {
        const toast = useToast();
        try {
            const merchantId = localStorage.getItem('merchantId')
            productRequest.merchantId = merchantId;
            console.log(productRequest);
            const response = await axios.post(`${HOST_URL}/product/create`, productRequest)
            const status = response.data.status;
            this.showModal = false;
            if(status) {
                toast.success("Product created")
                await this.fetchAllProductsByMerchantId();
            } else {
                toast.error(response.data.errorMessage);
            }


        } catch(error) {
            console.log(error)
            this.showModal = false;
            toast.error("Unable to create product !");
        }

    },

    openEditModal(product) {
        console.log("Inside open edit modal:");
        console.log(product)
        this.selectedProduct = product;
        this.editProductModal = true;
    },

    async saveProductChanges(updatedProduct) {
        console.log("Product Changes here")
        console.log(updatedProduct)
        const toast = useToast();
        try {
            const myId = updatedProduct.id;
            delete updatedProduct.id;
            const response = await axios.post(`${HOST_URL}/product/${myId}/update-product`, updatedProduct)
            if(response.data.status == 'success') {
                toast.success("product with id: " + myId + " is updated successfully");
                await this.fetchAllProductsByMerchantId();
            } else {
                console.log(response.data);
            }

        } catch(error) {
            console.log(error);
            toast.error("Failed to update the product with id: " + updatedProduct.id);
        } finally {
            this.editProductModal = false;
        }

    },

    updateCart({ product, quantity }) {
      this.cart[product.productId] = quantity;
    },

    async deleteProduct(product) {
      console.log("delete-product:", product);
      const toast = useToast();
      try {
          await axios.delete(`${HOST_URL}/product/${product.id}/delete-product`)
          await this.fetchAllProductsByMerchantId();
          toast.success("Product deleted successfully with id : " + product.id)
      } catch(error) {
          console.log(error);
          toast.success("Unable to delete Product with id : " + product.id)
      }
    },

    addProduct() {
      console.log("added product");
    },

    async checkoutSession(sessionName) {
      console.log("checkout-done");
      console.log("Selected products:", this.cart);
      const toast = useToast();
      const itemList = Object.entries(this.cart).map(([productId, quantity]) => ({
            productId: productId,
            quantity: quantity
        }));

      const source = MNEE_STRIPE_DASHBOARD;
      const merchantApiKey = localStorage.getItem('merchantApiKey');

      const payload = {
          merchantApiKey: merchantApiKey,
          itemList: itemList,
          source: source,
          name: sessionName,
      }

      console.log(payload)

      try {
          const response = await axios.post(`${HOST_URL}/checkout-session/create`, payload)
          if(response.data.status == 'success') {
              toast.success("Successfully create checkout-session with id: " + response.data.checkoutSession.id);
          } else {
              console.log(response.data.errorMessage)
              toast.error("Failed to create checkout-session");
          }

      } catch(error) {
          console.log(error)
          toast.error("Failed to create checkout-session");
      } finally {
        this.checkoutModal = false;
      }
    },

    async handleCsvData(jsonData) {
      

      // Example: call a function to process products
      await this.processProducts(jsonData);
    },

    async processProducts(jsonData) {
      // Example function: currently just logs
       console.log(jsonData)
       const toast = useToast();
        try {
            const response = await axios.post(`${HOST_URL}/product/create-all`, jsonData)
            console.log(response)
            if(response.status == 200) {
                toast.success("Imported prestashop products")
                await this.fetchAllProductsByMerchantId();
            } else {
                toast.error("Error uploading products");
                console.log(response.data);
            }
        } catch(error) {
            console.log(error)
            this.showModal = false;
            toast.error("Unable to create product !");
        } finally {
          this.showCsvModal = false;
        }

      // TODO: send to backend API if needed
    }
  },

  mounted() {
      this.fetchAllProductsByMerchantId();
  }
};
</script>

<style scoped>

/* Page layout */
.product-page {
  padding: 10px;
  font-family: 'Lucida Fax';
}

/* Header row with buttons on the right */
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Button container */
.btn-group {
  display: flex;
  gap: 12px;
}

/* Gradient Buttons */
.add-btn {
  padding: 10px 16px;
  background: linear-gradient(135deg, #7cd3ff, #0066cc);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;
}

.add-btn:hover {
  transform: scale(1.05);
}

.import-btn {
  padding: 10px 16px;
  background: linear-gradient(135deg, #0f3142, #056583);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;
}

.import-btn:hover {
  transform: scale(1.05);
}

/* Checkout button */
.checkout-btn {
  padding: 10px 16px;
  background: linear-gradient(135deg, #ff8c5f, #b23a00);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;
}

.checkout-btn:disabled {
  background: #c9c9c9;
  cursor: not-allowed;
}

.checkout-btn:not(:disabled):hover {
  transform: scale(1.05);
}

/* Product list grid */
.product-list {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
}
</style>
