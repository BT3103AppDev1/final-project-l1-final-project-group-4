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
      <div class="cart-item-right">
        <div class="cart-item-cost">
          <span>${{ (item.cost * item.quantity).toFixed(2) }}</span>
        </div>
        <div class="cart-item-actions">
          <button @click="removeFromCart(item.id)" class="cart-remove-button">Remove</button>
        </div>
      </div>
    </div>
    
    
    <div class="cart-address">
      <label for="address">Shipping Address:</label>
      <input v-model="shippingAddress" id="address" type="text" placeholder="Enter your address" />
    </div>

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
      cartItems: [],
      shippingAddress: ''
    };
  },
  mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const fbCartItems = [];
        const allDocs = await getDocs(collection(db, 'Green Rangers', user.uid, 'Cart'));

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

      const itemRef = doc(db, 'Green Rangers', currentUser.uid, 'Cart', itemId);
      await deleteDoc(itemRef);
      this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    },
    async updateQuantity(item) {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        alert("You must be logged in to modify the cart.");
        return;
      }

      const itemRef = doc(db, 'Green Rangers', currentUser.uid, 'Cart', item.id);
      await updateDoc(itemRef, {
        quantity: item.quantity
      });
    },
    checkout() {
      if (!this.shippingAddress) {
        alert("Please enter your shipping address.");
        return;
      }
      this.$router.push({
        path: '/confirmation',
        query: {
          total: this.total.toFixed(2),
          cartItems: encodeURIComponent(JSON.stringify(this.cartItems)),
          shippingAddress: this.shippingAddress // Pass the shipping address as a query parameter
        }
      });
    },

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
.cart-address {
  width: 100%;
  margin: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.cart-address label {
  font-size: 18px;
  margin-bottom: 10px;
  color: #5e8c61; /* A softer green for better readability */
}

.cart-address input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e2e2e2;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 20px;
}

.cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px; /* Increased padding for a more spacious layout */
  background-color: #f9f9f9; /* A light background to soothe the eyes */
  border-radius: 8px; /* Rounded corners for the cart container */
  box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* Subtle shadow for depth */
}

h1 {
  font-size: 28px; /* Larger heading for emphasis */
  color: #333; /* Darker color for better contrast */
  margin-bottom: 30px; /* More space around the heading */
}

.cart-item {
  display: flex;
  justify-content: space-between; /* Align children on both ends */
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.cart-item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Align price and button to the right */
}

.cart-item-cost {
  margin-bottom: 10px; /* Space between cost and remove button */
  font-size: 18px;
  font-weight: 500;
}

.cart-item-details {
  display: flex;
  align-items: center;
}

.cart-item-image {
  width: 100px; /* Larger image for better visibility */
  height: 100px;
  object-fit: cover;
  margin-right: 20px; /* More space between image and details */
  border-radius: 8px;
}

.cart-item-info {
  display: flex;
  flex-direction: column;
}

.cart-item-title {
  font-size: 20px;
  font-weight: 500;
  width: 300px; 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis;
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  margin-top: 10px; /* More space between title and quantity */
}

.cart-item-quantity span {
  margin-right: 10px; /* More space around quantity label */
}

.cart-item-quantity input {
  width: 60px; /* Larger input for easier interaction */
  padding: 10px; /* More padding inside input */
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  font-size: 16px;
}

.cart-remove-button {
  background-color: #f44336; /* A more standard red for delete buttons */
  color: white;
  border: none;
  padding: 10px 15px; /* Larger button for easier interaction */
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.cart-remove-button:hover {
  background-color: #d32f2f; /* Darker shade on hover for feedback */
}

.checkout-button {
  background-color: #5e8c61; /* Soft green color for the checkout button */
  color: white;
  border: none;
  padding: 15px 30px; /* Larger button for prominence */
  font-size: 18px; /* Larger font size for readability */
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 30px; /* More space above the checkout button */
}

.checkout-button:hover {
  background-color: #4b704d; /* A darker shade for interactive feedback */
}

.cart-total {
  font-size: 22px; /* Larger font size for total cost */
  font-weight: 600; /* Bolder font for emphasis */
  margin-top: 30px; /* More space above the total */
  self-align: flex-end; /* Align total to the right */
}
</style>
