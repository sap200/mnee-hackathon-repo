<template>
  <div class="modal-overlay">
    <div class="modal">

      <!-- HEADER -->
      <div class="modal-header">
        <h3>Edit Product</h3>
        <button class="close-btn" @click="$emit('close')">✖</button>
      </div>

      <!-- FORM -->
      <form @submit.prevent="updateProduct">
        <div class="form-row">
          <label>Product ID:</label>
          <input v-model="form.productId" required />
        </div>

        <div class="form-row">
          <label>Name:</label>
          <input v-model="form.name" />
        </div>

        <div class="form-row">
          <label>Description:</label>
          <textarea v-model="form.description"></textarea>
        </div>

        <div class="form-row">
          <label>Image URL:</label>
          <input v-model="form.imageURL" />
        </div>

        <div class="form-row">
          <label>Price:</label>
          <input type="number" v-model="form.priceAmount" step="0.01" />
          <span class="currency">MNEE</span>
        </div>

        <button class="save-btn" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? "Saving..." : "Save Changes" }}
        </button>
      </form>

    </div>
  </div>
</template>

<script>
export default {
  name: "EditProductModal",
  props: {
    product: { type: Object, required: true }
  },
  data() {
    return {
      isSubmitting: false,
      // Copy only editable fields to avoid mutating props directly
      form: {
        id: this.product.id || "",
        productId: this.product.productId || "",
        name: this.product.name || "",
        description: this.product.description || "",
        imageURL: this.product.imageURL || "",
        priceAmount: this.product.priceAmount || 0
      }
    };
  },
  methods: {
    async updateProduct() {
      this.isSubmitting = true;
      try {
        // Emit an update event with updated fields and the product id
        this.$emit("update", {
          id: this.product.id,
          ...this.form
        });
      } catch (err) {
        console.error(err);
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
/* Reuse the modal styles from AddProductModal */
.modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.4); display:flex; justify-content:center; align-items:center; }
.modal { background:white; width:450px; padding:20px; border-radius:10px; position:relative; }
.modal-header { display:flex; justify-content:space-between; align-items:center; }
.close-btn { background:red; color:white; font-weight:bold; border:none; padding:5px 9px; border-radius:5px; cursor:pointer; }
.form-row { margin:12px 0; display:flex; align-items:center; }
.form-row label { width:120px; font-weight:bold; }
.form-row input, .form-row textarea { flex:1; padding:6px; }
.currency { margin-left:8px; color:darkgoldenrod; }
.save-btn { margin-top:20px; width:100%; padding:10px; background:#2e7d32; color:white; border:none; cursor:pointer; font-size:16px; }
.save-btn:disabled { background: #999; cursor:not-allowed; }
</style>
