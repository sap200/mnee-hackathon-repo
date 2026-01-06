<template>
  <div class="product-card">

    <!-- Delete button -->
    <div class="action-buttons">
        <button class="edit-btn" @click="$emit('edit-product', product)">✏️</button>
        <button class="delete-btn" @click="deleteProduct">✖</button>
    </div>
    <br>
    <hr>


    <p class="row"><span class="label">ID:</span> {{ product.id }}</p>
    <p class="row"><span class="label">Name:</span> {{ product.name }}</p>
    <p class="row"><span class="label">Product ID:</span> {{ product.productId }}</p>

    <div class="image-container">
      <img :src="product.imageURL" alt="Product Image">
    </div>

    <p class="row"><span class="label">Price:</span> {{ product.priceAmount }} {{ product.currency }}</p>

    <hr>

    <div class="qty-box">
      <button
        class="qty-btn"
        :disabled="quantity === 0"
        @click="decrease"
      >-</button>

      <span class="qty-value">{{ quantity }}</span>

      <button class="qty-btn" @click="increase">+</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductCard",

  props: {
    product: Object,
  },

  data() {
    return {
      quantity: 0,
    };
  },

  methods: {
    increase() {
      this.quantity++;
      this.$emit("update-cart", {
        product: this.product,
        quantity: this.quantity,
      });
    },

    decrease() {
      if (this.quantity > 0) {
        this.quantity--;
        this.$emit("update-cart", {
          product: this.product,
          quantity: this.quantity,
        });
      }
    },

    deleteProduct() {
      console.log("delete");
      this.$emit("delete-product", this.product);
    }
  },
};
</script>

<style scoped>
.product-card {
  width: 350px;
  padding: 16px;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(0,0,0,0.15);
  position: relative;
  transition: 0.2s ease;
  font-family: 'Lucida Fax';
}


.product-card:hover {
  transform: translateY(-3px);
}

.action-buttons {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 15px; /* space between edit + delete buttons */
}

/* Edit Button */
.edit-btn {
  border: none;
  background: #d2d39d;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: 0.2s ease;
}

.edit-btn:hover {
  background: #b8a82c;
}

/* Delete Button */
.delete-btn {
  border: none;
  background: #ff4d4d;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: 0.2s ease;
}

.delete-btn:hover {
  background: #d43232;
}


/* Label + Value row */
.row {
  margin: 6px 0;
  font-size: 15px;

   /* Make it act like two columns */
  display: grid;
  grid-template-columns: 110px 1fr;  /* label column | value column */
  align-items: center;

  text-align: left; /* full left align */
}

.label {
  font-weight: bold;
  color: #6b3e26;
  margin-right: 5px;
}

/* Image box */
.image-container {
  width: 100%;
  height: 120px;
  margin: 12px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9f4ef;
  border-radius: 10px;
  border: 1px solid #d9c5b2;
}

.image-container img {
  max-width: 90%;
  max-height: 90%;
}

/* Quantity section */
.qty-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 14px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  background: #6b3e26;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: 0.2s ease;
}

.qty-btn:disabled {
  background: #b8a39a;
  cursor: not-allowed;
}

.qty-value {
  margin: 0 14px;
  font-weight: bold;
  font-size: 18px;
}
</style>
