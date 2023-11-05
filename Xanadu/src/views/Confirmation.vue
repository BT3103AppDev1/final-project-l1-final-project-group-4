<template>
  <div class="confirmation">
      <h1>Confirmation</h1>
      <p>Your total is: ${{ finalTotal.toFixed(2) }}</p>
      <p>Please scan this QR code to pay:</p>
      <img src="@/assets/paylah.png" alt="Payment QR Code" class="qr-code" />
      <div class="upload-section">
          <p>After payment, please attach confirmation of payment:</p>
          <input type="file" @change="onFileChange" />
          <button @click="uploadImage">Submit Confirmation</button>
      </div>
  </div>
</template>

<script>
import firebaseApp from "@/firebase.js";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  arrayUnion
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);

export default {
  data() {
    return {
      finalTotal: 0,
      paymentConfirmation: null,
      cartItems: [], // This should be populated with the items in the user's cart
      currentUser: null // Holds the current user's information
    };
  },
  mounted() {
    if (this.$route.query.total) {
      this.finalTotal = parseFloat(this.$route.query.total);
    }
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser = user;
        // Here you could also fetch the user's cart items if needed
      } else {
        // User is signed out
        this.$router.push('/login'); // Redirect to login page or handle accordingly
      }
    });
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      this.paymentConfirmation = file;
    },
    async uploadImage() {
      if (!this.paymentConfirmation) return alert("No confirmation image provided.");

      const storageRef = ref(storage, `confirmation/${this.paymentConfirmation.name}`);
      await uploadBytes(storageRef, this.paymentConfirmation);
      const downloadURL = await getDownloadURL(storageRef);

      try {
        // Create the order
        const orderRef = await addDoc(collection(db, 'orders'), {
          user: this.currentUser.uid,
          items: this.cartItems,
          total: this.finalTotal,
          paymentConfirmationURL: downloadURL,
          status: 'pending' // Initial status of the order
        });

        // Update user's order list
        const userRef = doc(db, 'users', this.currentUser.uid);
        await updateDoc(userRef, {
          orders: arrayUnion(orderRef.id) // Add the new order ID to the user's orders array
        });

        // Update each product with the username in their pendingOrders
        for (const item of this.cartItems) {
          const productRef = doc(db, 'products', item.id);
          await updateDoc(productRef, {
            pendingOrders: arrayUnion({
              username: this.currentUser.displayName || this.currentUser.email,
              orderId: orderRef.id,
              quantity: item.quantity
            })
          });
        }

        alert("Order confirmed and records updated successfully!");

      } catch (error) {
        console.error("Error updating records: ", error);
        alert("There was an error processing your order. Please try again.");
      }
    }
  }
}
</script>



<style>
.confirmation {
  padding: 20px;
  max-width: 600px;
  margin: 40px auto;
  background-color: #f7f9fc;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2em;
  margin-bottom: 20px;
}

.qr-code {
  display: block;
  margin: 20px auto;
  width: 150px;
  height: 150px;
}

.upload-section {
  margin-top: 30px;
}

.upload-section p {
  margin-bottom: 10px;
}

.upload-section button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upload-section button:hover {
  background-color: #45a049;
}
</style>
