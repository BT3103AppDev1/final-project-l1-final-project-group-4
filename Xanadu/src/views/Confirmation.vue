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
import { getFirestore, collection, addDoc, getDoc, writeBatch, doc, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);

export default {
  data() {
    return {
      finalTotal: 0,
      paymentConfirmation: null,
      shippingAddress: ''
    };
  },
  mounted() {
    // Retrieve the shipping address from the query parameters
    const queryParams = this.$route.query;
    if (queryParams.total) {
      this.finalTotal = parseFloat(queryParams.total);
    }
    if (queryParams.shippingAddress) {
      this.shippingAddress = queryParams.shippingAddress;
    }
    // You can also decode and parse the cart items here if needed
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      this.paymentConfirmation = file;
    },
    async uploadImage() {
      if (!this.paymentConfirmation) return alert("No confirmation image provided.");
      if (!this.shippingAddress) {
        alert("Shipping address is missing.");
        return;
      }
      const storageRef = ref(storage, `confirmation/${this.paymentConfirmation.name}`);
      await uploadBytes(storageRef, this.paymentConfirmation);
      const downloadURL = await getDownloadURL(storageRef);

      if (!auth.currentUser) {
        alert("You must be logged in to place an order.");
        return;
      }

      const userRef = doc(db, 'Users', auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists() || !userSnap.data().username) {
        alert("Unable to retrieve buyer username. Please ensure your profile is complete.");
        return;
      }
      const buyerUsername = userSnap.data().username;

      const cartItemsWithSellers = JSON.parse(decodeURIComponent(this.$route.query.cartItems));
      const timestamp = new Date();
      const batch = writeBatch(db);

      const userOrderRef = doc(collection(db, 'Green Rangers', auth.currentUser.uid, 'Orders'));
      batch.set(userOrderRef, {
        orderPlacedAt: timestamp,
        total: this.finalTotal,
        paymentConfirmationURL: downloadURL,
        status: 'Pending',
        buyerUsername: buyerUsername,
        shippingAddress: this.shippingAddress,
      });

      for (const item of cartItemsWithSellers) {
        const productRef = doc(collection(userOrderRef, 'Products'));
        batch.set(productRef, {
          productName: item.title,
          productPrice: item.cost,
          productQuantity: item.quantity,
          sellerUid: item.uid,
          productCategory: item.categories,
        });

        const sellerOrdersRef = collection(db, 'Eco-Entrepreneur', item.uid, 'Orders');
        const sellerOrderDocRef = doc(sellerOrdersRef);
        batch.set(sellerOrderDocRef, {
          productName: item.title,
          productPrice: item.cost,
          productQuantity: item.quantity,
          buyerUid: auth.currentUser.uid,
          buyerUsername: buyerUsername,
          paymentConfirmationURL: downloadURL,
          orderPlacedAt: timestamp,
          productCategory: item.categories,
          shippingAddress: this.shippingAddress,
        });
      }

      const cartRef = collection(db, 'Green Rangers', auth.currentUser.uid, 'Cart');
      const cartSnapshot = await getDocs(cartRef);
      cartSnapshot.forEach((cartDoc) => {
        batch.delete(cartDoc.ref);
      });

      await batch.commit();

      // Redirect the user to the marketplace page after the batch operation is completed
      this.$router.push('/marketplace').then(() => {
        alert("Order placed and added to your orders successfully!");
      }).catch(err => {
        // Handle any errors that occur during navigation
        console.error(err);
      });
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
