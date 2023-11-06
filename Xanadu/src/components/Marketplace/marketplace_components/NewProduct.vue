<script>
import firebaseApp from "@/firebase.js";
import { getFirestore, setDoc, getDoc, doc, collection, deleteDoc, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";  // Import these functions only once


const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);



export default {
    data() {
        return {
            
            showfile: false,
            img1: null,
            imageData: false,
            user: null,  // 2. Set to null by default
            Title: "",
            ShortDesc: "",
            Shipping: "",
            Dimensions: "",
            Desc: "",
            Cost: "",
            categories: ["Electronics", "Clothing", "Home & Garden", "Books", "Toys & Games", "Sports & Outdoors", "Beauty & Personal Care"],
            selectedCategories: [],
            uid: null,
        }
    },
    mounted() {
        const auth = getAuth(firebaseApp);
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.user = user;
                await this.fetchUsername(user.uid);
            }
        });
    },
    methods : {

        async fetchUsername(uid) {
            try {
                // Assuming 'Users' collection has a document for each user with the 'username' field
                const userDocRef = doc(db, 'Users', uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    // Set the username in the component's data
                    this.username = userDocSnap.data().username;
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.log("Error getting document:", error);
            }
        },
        triggerInput() {
            this.$refs.uploadPictures.click()
        },
        uploadPictures(event) {
            this.uploadValue=0;
            this.img1=null;
            this.imageData = event.target.files[0];
            this.onUpload()

        },
        onUpload(){
            this.img1=null;
            const childref = ref(storage, `${this.imageData.name}`)
            const storageRef=uploadBytesResumable(childref,this.imageData);
            storageRef.on(`state_changed`,snapshot=>{
            this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                }, error=>{console.log(error.message)},
            ()=>{this.uploadValue=100;
                getDownloadURL(storageRef.snapshot.ref).then((url)=>{
                    this.img1 =url;
                    console.log(this.img1)
                    });
                }      
                );
            },
            async AddProduct() {

                this.$toast.add({
                    severity: "info",
                    summary: "Adding New Product",
                    life: 3000,
                });
                
                
                // Setting the product inside the 'Products' collection
                const productDocRef = doc(db, 'Products', this.Title);
                await setDoc(productDocRef, {
                    title: this.Title,
                    shortdesc: this.ShortDesc,
                    shipping: this.Shipping,
                    dimensions: this.Dimensions,
                    desc: this.Desc,
                    pictures: this.img1,
                    cost: this.Cost,
                    username: this.username,
                    categories: this.selectedCategories,
                    uid: this.user.uid,
                });


                const indivProductDocRef = doc(db, 'Eco-Entrepreneur', this.user.uid, 'Products', this.Title);

                await setDoc(indivProductDocRef, {
                    title: this.Title,
                    shortdesc: this.ShortDesc,
                    shipping: this.Shipping,
                    dimensions: this.Dimensions,
                    desc: this.Desc,
                    pictures: this.img1,
                    cost: this.Cost,
                    username: this.username,
                    categories: this.selectedCategories,
                    uid: this.user.uid,
                });
                
                // Retrieve the newly added product from the correct location
                const docSnap = await getDoc(productDocRef);
                console.log(docSnap.data());

                this.$toast.add({
                    severity: "success",
                    summary: "Added New Product",
                    life: 3000,
                });

                this.$router.push('/Marketplace');
            },
            toggleCategory(category) {
                if (this.selectedCategories.includes(category)) {
                    this.selectedCategories = this.selectedCategories.filter(cat => cat !== category);
                } else {
                    this.selectedCategories.push(category);
                }
            },
    }
}

</script>

<template>
    <div class="container">
      <Toast></Toast>
      <div class="image-uploader">
        <div v-if="img1" class="preview-image" :style="{ backgroundImage: 'url(' + img1 + ')' }"></div>
        <button @click="triggerInput" class="upload-btn">Upload Pictures</button>
        <input type="file" ref="uploadPictures" @change="uploadPictures" accept="image/*" multiple hidden>
      </div>
      <div class="form-section">
        <div class="form-group">
          <input v-model="Title" type="text" placeholder="Title">
          <input v-model="ShortDesc" type="text" placeholder="Short Description">
          <input v-model.number="Cost" type="number" placeholder="Cost">
        </div>
        <div class="form-group">
          <input v-model="Dimensions" type="text" placeholder="Dimensions (e.g., '10x10x0.5')">
          <input v-model="Shipping" type="text" placeholder="Shipping and Return Information">
          <textarea v-model="Desc" placeholder="Detailed Description"></textarea>
        </div>
      </div>
      <div class="category-selector">
        <h5>Select Category</h5>
        <div class="categories">
          <!-- Loop through categories for checkboxes -->
          <label v-for="category in categories" :key="category" class="category-label">
            <input type="checkbox" :value="category" v-model="selectedCategories">
            {{ category }}
          </label>
        </div>
      </div>
      <button @click="AddProduct" class="submit-btn">Add Product</button>
    </div>
  </template>
  
  

  <style>
  .container {
    font-family: 'Montserrat', sans-serif;
    max-width: 1200px;
    margin: auto;
    padding: 2rem;
  }
  
  /* Use CSS variables for colors to maintain consistency and make it easier to change */
  :root {
    --primary-color: #748C70;
    --secondary-color: #5A6F57;
    --background-color: #F0F2EF;
    --text-color: #333;
    --border-color: #CDD7CF;
  }
  
  .image-uploader {
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .preview-image {
    width: 100%;
    height: 256px;
    background-size: cover;
    background-position: center;
    border-radius: 5px;
  }
  
  .upload-btn {
    padding: 0.5rem 1rem;
    margin-top: 1rem;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .form-section {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .form-group {
    flex: 1;
    min-width: 250px;
  }
  
  .form-group input, .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 5px;
  }
  
  .category-selector {
    margin-bottom: 2rem;
  }
  
  .categories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .category-label {
    font-size: 0.9rem;
    user-select: none;
    cursor: pointer;
  }
  
  .submit-btn {
    padding: 1rem 2rem;
    background-color: var(--secondary-color);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>
  