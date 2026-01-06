<template>
  <div class="modal-overlay">
    <div class="modal">

      <!-- HEADER -->
      <div class="modal-header">
        <h3>Add Product</h3>
        <button class="close-btn" @click="$emit('close')">✖</button>
      </div>

      <!-- FORM -->
      <form @submit.prevent="saveProduct">
        <div class="form-row">
          <label>Product ID:</label>
          <input v-model="form.productId" required/>
        </div>

        <div class="form-row">
          <label>Image URL:</label>
          <input v-model="form.imageURL" required/>
        </div>

        <div class="form-row">
          <label>Name:</label>
          <input v-model="form.name" required/>
        </div>

        <div class="form-row">
          <label>Description:</label>
          <textarea v-model="form.description" required></textarea>
        </div>

        <div class="form-row">
          <label>Price:</label>
          <input type="number" v-model="form.priceAmount" step="0.01" required/>
          <span class="currency">MNEE</span>
        </div>

        <button class="save-btn" type="submit" :disabled="isSubmitting">{{this.isSubmitting ? "Saving..." : "Save"}}</button>
      </form>

    </div>
  </div>
</template>

<script>
export default {
  name: "AddProductModal",

  data() {
    return {
      form: {
        merchantId: "",
        productId: "",
        imageURL: "",
        name: "",
        description: "",
        priceAmount: ""
      },
      isSubmitting: false
    };
  },

  methods: {
    saveProduct() {
      this.isSubmitting = true;
      console.log("Saved Product:", this.form);
      this.$emit("save", this.form);
    }
  }
};
</script>

<style scoped>
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
  pointer-events: auto;
}

.modal {
  background: white;
  width: 450px;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  pointer-events: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: red;
  color: white;
  font-weight: bold;
  border: none;
  padding: 5px 9px;
  border-radius: 5px;
  cursor: pointer;
}

.form-row {
  margin: 12px 0;
  display: flex;
  align-items: center;
}

.form-row label {
  width: 120px;
  font-weight: bold;
}

.form-row input,
.form-row textarea {
  flex: 1;
  padding: 6px;
}

.currency {
  margin-left: 8px;
  color:darkgoldenrod;
}

.save-btn {
  margin-top: 20px;
  width: 100%;
  padding: 10px;
  background: #2e7d32;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
}
</style>
