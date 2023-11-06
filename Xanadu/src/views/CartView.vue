<template>
  <div class="cart">
    <h1>Your Cart</h1>
    <div v-for="item in cartItems" :key="item.id" class="cart-item">
      <div class="cart-item-details">
        <img :src="item.picture" alt="Product Image" class="cart-item-image">
        <div class="cart-item-info">
          <p class="cart-item-title">{{ item.title }}</p>
          <div class="cart-item-quantity">
            <span>Quantity:</span>
            <input v-model="item.quantity" @input="updateQuantity(item)" type="number" min="1">
          </div>
        </div>
      </div>
      <div class="cart-item-actions">
        <button @click="removeFromCart(item.id)" class="cart-remove-button">Remove</button>
      </div>
    </div>
    
    <!-- Display total cost -->
    <div class="cart-total">
      <strong>Total:</strong> ${{ total.toFixed(2) }}
    </div>

    <button @click="checkout" class="checkout-button">Checkout</button>
  </div>
</template>

<script>
import { getFirestore, getDocs, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

export default {
  data() {
    return {
      cartItems: []
    };
  },
  mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const fbCartItems = [];
        const allDocs = await getDocs(collection(db, 'Eco-Entrepreneur', user.uid, 'Cart'));

        allDocs.forEach((doc) => {
          let item = doc.data();
          item.id = doc.id;
          fbCartItems.push(item);
        });

        this.cartItems = fbCartItems;
      }
      // else {
      //   alert("You must be logged in to view your cart.");
      // }
    });
  },
  methods: {
    async removeFromCart(itemId) {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        alert("You must be logged in to modify the cart.");
        return;
      }

      const itemRef = doc(db, 'Eco-Entrepreneur', currentUser.uid, 'Cart', itemId);
      await deleteDoc(itemRef);
      this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    },
    async updateQuantity(item) {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        alert("You must be logged in to modify the cart.");
        return;
      }

      const itemRef = doc(db, 'Eco-Entrepreneur', currentUser.uid, 'Cart', item.id);
      await updateDoc(itemRef, {
        quantity: item.quantity
      });
    },
    checkout() {
      this.$router.push({
        path: '/confirmation',
        query: { total: this.total.toFixed(2) } // Passing total as a query parameter
      });
    }

  },
  computed: {
    total() {
      return this.cartItems.reduce((sum, item) => {
        let cost = (typeof item.cost === 'number') ? item.cost : 0;
        let quantity = (typeof item.quantity === 'number') ? item.quantity : 0;
        return sum + cost * quantity;
      }, 0);
    }
  },
  
}
</script>

<style>
.cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
h1 {
  font-size: 24px;
  margin-bottom: 20px;
}
.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.cart-item-details {
  display: flex;
  align-items: center;
}
.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 5px;
}
.cart-item-info {
  display: flex;
  flex-direction: column;
}
.cart-item-title {
  font-size: 18px;
}
.cart-item-quantity {
  display: flex;
  align-items: center;
  margin-top: 5px;
}
.cart-item-quantity span {
  margin-right: 5px;
}
.cart-item-quantity input {
  width: 40px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  text-align: center;
  font-size: 14px;
}
.cart-item-actions {
  margin-left: auto;
}
.cart-remove-button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 10px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.cart-remove-button:hover {
  background-color: #ff3333;
}
.checkout-button {
  background-color: #748C70;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
}
.checkout-button:hover {
  background-color: #657B61;
}
.cart-total {
  margin-top: 20px;
  font-size: 20px;
}
</style>
