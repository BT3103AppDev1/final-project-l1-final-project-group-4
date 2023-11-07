<template>
    <div class="product-view">
      <div class="product-content">
        <img :src="product.picture" alt="Product Image" class="product-view-image">
        <h2 class="product-title">{{ product.title }}</h2>
        <p class="product-description">{{ productDescription }}</p>
        <div class="quantity-input">
          <label for="quantity">Quantity:</label>
          <input v-model="quantity" type="number" id="quantity" min="1">
        </div>
        <button @click="addToCart(product, quantity)" class="cart-btn">Add to Cart</button>
      </div>
    </div>
  </template>
  
  <script>
  import { getFirestore, doc, getDoc, collection, addDoc } from "firebase/firestore";
  
  const db = getFirestore();
  
  export default {
    data() {
      return {
        product: {},
        quantity: 1 // Default quantity is set to 1
      };
    },
    computed: {
      productDescription() {
        return this.product.description || "No description";
      }
    },
    beforeRouteEnter(to, from, next) {
      const productRef = doc(db, 'Eco-Entrepreneur', 'testuser', 'Products', to.params.id);
  
      getDoc(productRef).then((productDoc) => {
        const productData = productDoc.data();
  
        next(vm => {
          vm.product = {
            id: productDoc.id,
            title: productData.title,
            description: productData.description,
            picture: productData.pictures
          };
        });
      });
    },
    methods: {
      async addToCart(product, quantity) {
        console.log("Product to add:", product, "Quantity:", quantity);
  
        const cartRef = collection(db, 'Eco-Entrepreneur', 'testuser', 'Cart');
  
        const productToAdd = {
          title: product.title || "No title",
          picture: product.picture,
          description: this.productDescription,
          quantity // Include the quantity
        };
  
        console.log("Processed product to add:", productToAdd);
  
        await addDoc(cartRef, productToAdd);
        alert("Added to cart!");
      }
    }
  }
  </script>
  
  <style>
  .product-view {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    height: 100vh; /* Take up full viewport height */
    background-color: #f4f4f4; /* Light gray background */
  }
  
  .product-content {
    background: #fff;
    padding: 20px;
    max-width: 600px;
    border-radius: 10px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .product-view-image {
    width: 100%;
    max-width: 500px;
    height: auto;
    object-fit: cover;
    margin-bottom: 20px;
    border-radius: 10px; /* Rounded edges for the image */
  }
  
  .product-title {
    font-size: 24px; /* Increased title font size */
    margin-bottom: 10px;
    color: #333; /* Darker text for readability */
  }
  
  .product-description {
    font-size: 18px; /* Increased description font size */
    margin: 20px 0; /* Add some spacing above and below the description */
    line-height: 1.5;
    color: #555; /* Darker text for readability */
  }
  
  .quantity-input {
    margin: 10px 0;
    display: flex;
    align-items: center;
  }
  
  .quantity-input label {
    margin-right: 10px;
    font-size: 18px;
  }
  
  .quantity-input input {
    width: 40px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
    text-align: center;
    font-size: 16px;
  }
  
  .cart-btn {
    background-color: #748C70;
    color: white;
    border: none;
    padding: 12px 24px; /* Increased padding */
    font-size: 18px; /* Increased font size */
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .cart-btn:hover {
    background-color: #657B61; /* Darken the button color on hover */
  }
  </style>
  