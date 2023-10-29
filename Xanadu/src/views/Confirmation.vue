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
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);

export default {
  data() {
    return {
      finalTotal: 0,
      paymentConfirmation: null
    };
  },
  mounted() {
    if (this.$route.query.total) {
      this.finalTotal = parseFloat(this.$route.query.total);
    }
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

      const ordersCollectionRef = collection(db, 'orders');
      await addDoc(ordersCollectionRef, {
        paymentConfirmationURL: downloadURL
      });

      alert("Confirmation uploaded successfully!");
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
