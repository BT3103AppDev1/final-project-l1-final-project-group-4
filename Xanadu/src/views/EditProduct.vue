<template>
<div v-if="isSeller">
    <div class="upperhalf">
        <div class="AddImages" :style ="{'background-image' : 'url('+
        imgdisplay+')'}">
            <div class="UploadImages">
                <button @click ="triggerInput" id="UploadPictures">Update Picture</button>
                <input type="file" 
                ref = "uploadPictures"
                @change="uploadPictures"
                v-show="showfile"
                accept="image/*" >   
    
            </div>
        </div>
        <div class="titleAndDesc">
            <p id="Title" name="Title" v-text= "product.title"></p>
            <input v-model="ShortDesc" type="text" id="ShortDesc" name="ShortDesc" :placeholder="product.shortdesc">
            <input v-model.number="Cost" type="number" id="Cost" name="Cost" :placeholder="product.cost">
        </div>
    </div>
    <div class="lowerhalf">
        <div class="lowerleft">
            <div id="productdetail">Product Detail</div>
            <div id="dimension">
                <h5 id="dimTitle">Dimensions </h5>
                <input v-model="Dimensions" type="text" id="dimInput" name="dimensions" :placeholder="product.dimensions">
            </div>
            <div id="shipping">
                <h5 id="shipTitle">Shipping and Return</h5>
                <input v-model="Shipping" type="text" id="shipInput" name="shipping" :placeholder="product.shipping">
            </div>    
        </div>
        <div class="lowerright">
            <div id="description">
                <h5 id="descTitle">Description </h5>
                <input v-model="Desc" type="text" id="descInput" name="desc" :placeholder="product.description">
            </div>
            <div id="editButton">
                <button @click = "Update" class="button">Update</button>
            </div>
        </div>
    </div>
</div>
<div v-else class="Not-found">
    <h3 id="Title">Page Not Found !! </h3>
    <button class= "return-button" @click="$router.push('/marketplace')">Return to Marketplace</button>
</div>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import router from "../router/index.js";

const db1 = getFirestore();
const auth1 = getAuth();

const isLoading = ref(true); // New ref to handle the loading state
const isLoggedIn = ref(false);
const isBuyer = ref(false);
const isSeller = ref(false);

// Define the names of your public pages
const publicPages = ['login', 'register', 'landing'];

const checkUserStatus = async () => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth1, async (user) => {
      isLoading.value = true; // Start loading
      if (user) {
        // User is signed in
        isLoggedIn.value = true;
        const userDocRef = doc(db1, 'Users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userInfo = userDocSnap.data();
          isSeller.value = userInfo.userType === 'Eco-Entrepreneur';
          isBuyer.value = userInfo.userType === 'Green Ranger';
        }
      } else {
        // No user is signed in
        isLoggedIn.value = false;
        isSeller.value = false;
        isBuyer.value = false;
      }
      isLoading.value = false; // Stop loading
      resolve();
    });
  });
};

onMounted(async () => {
  await checkUserStatus();
});
</script>

<script>
import {uploadBytes, getDownloadURL, uploadBytesResumable, getStorage } from "firebase/storage";
  import { getFirestore, doc, getDoc, collection, addDoc, updateDoc } from "firebase/firestore";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import firebaseApp from "@/firebase.js";
  
  const storage = getStorage(firebaseApp);
  const db = getFirestore();
  const auth = getAuth();

export default {
    data() {
      return {
        product: {},
        Title: "",
        ShortDesc: "",
        Shipping: "",
        Dimensions: "",
        Desc: "",
        Cost: "",
        showfile : false,
        img1: null,
        user: null
      };
    },
    mounted() {
        const auth = getAuth(firebaseApp);  // 3. Check the authentication state
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
            }
        });
    },
    computed: {
      productDescription() {
        return this.product.description || "No description";
      },
      imgdisplay() {
        return this.img1 || this.product.picture;
      }
    },
    beforeRouteEnter(to, from, next) {
    const productRef = doc(db, 'Products', to.params.id);
    getDoc(productRef).then((productDoc) => {
      if (productDoc.exists) {
        const productData = productDoc.data();
        next(vm => {
          vm.product = {
            id: productDoc.id,
            title: productData.title,
            description: productData.desc,
            picture: productData.pictures,
            cost: productData.cost,
            dimensions: productData.dimensions,
            shipping: productData.shipping,
            shortdesc: productData.shortdesc
          };
        });
      } else {
        console.error("Product not found!");
        next(false);
      }
    }).catch((error) => {
      console.error("Error fetching product:", error);
      next(false);
    });},
    methods: {
        async Update() {
            console.log('Updating product: '+ this.product.title)
            const productRef = doc(db, 'Products', this.product.title)
            const indivUserProductRef = doc(db, 'Eco-Entrepreneur', this.user.uid, 'Products',this.product.title)
            if (this.ShortDesc) {
                await updateDoc(productRef, {
                    shortdesc: this.ShortDesc
                });
                await updateDoc(indivUserProductRef, {
                    shortdesc: this.ShortDesc
                });
            }
            if (this.Shipping) {
                await updateDoc(productRef, {
                    shipping: this.Shipping
                });
                await updateDoc(indivUserProductRef, {
                    shipping: this.Shipping
                });
            }
            if (this.Dimensions) {
                await updateDoc(productRef, {
                    dimensions: this.Dimensions
                });
                await updateDoc(indivUserProductRef, {
                    dimensions: this.Dimensions
                });
            }
            if (this.Desc) {
                await updateDoc(productRef, {
                    desc: this.Desc
                });
                await updateDoc(indivUserProductRef, {
                    desc: this.Desc
                });
            }
            if (this.Cost) {
                await updateDoc(productRef, {
                    cost: this.Cost
                });
                await updateDoc(indivUserProductRef, {
                    cost: this.Cost
                });
            }
            if (this.img1) {
                await updateDoc(productRef, {
                    pictures: this.img1
                })
                await updateDoc(indivUserProductRef, {
                    pictures: this.img1
                })
            }
            this.$router.push('/marketplace')


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
            storageRef.on(
                `state_changed`,
                snapshot=>{
                    this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                }, 
                error=>{console.log(error.message)},
                ()=>{this.uploadValue=100;
                    getDownloadURL(storageRef.snapshot.ref).then((url)=>{
                    this.img1 =url;
                    console.log(this.img1)
                    });
                }      
            );
        },
    }
}

</script>

<style>

#addButton {
    margin: 20px 0px 0px 0px;
}

.button {
    background-color: #748C70;
    padding: 16px;
    width: 650px;
    color: white;
    font-family: Montserrat;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%; /* 22.4px */
    text-transform: capitalize;
}

.button:hover {
    background-color: #5A6D57;

}
.lowerhalf {
    
    margin: 11px 108px 0px 108px;
    display: flex;
}

.lowerleft {
    width: 650px;
    height:512px;
    align-items: center;
    background-color: #F0F2EF;
    display: block;
}

.lowerright {
    margin: 0px 0px 0px 50px;
    width: 650px;
    height:512px;
    align-items: center;
    display: block;
}

#description {
    height: 200px;
    border: 1px solid #CBCBCB;
    padding: 0px 24px 0px 24px;
    background-color: #F0F2EF;
}

#descTitle {
    color: var(--Black, #0C0C0C);

    /* bodyXL */
    font-family: Montserrat;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 180%; /* 36px */
    text-transform: capitalize;
    border-bottom: 1px solid #CBCBCB;
}

#productdetail {
    height: 28px;
    border: 1px solid #CBCBCB;
    padding: 24px;
    font-family: Montserrat;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    text-transform: capitalize;
}

#dimTitle, #shipTitle {
    color: var(--Primary, #748C70);
    /* H5 */
    font-family: Montserrat;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    text-transform: capitalize;
    
}

#dimension, #shipping {
    display: block;
    height: 215px;
    border: 1px solid #CBCBCB;
    padding: 0px 24px 0px 24px;

}

input[name="shipping"], input[name="dimensions"], input[name="desc"] {
    border: 1px solid #CDD7CF;
    width: 518px;
    height: 76px;
    background-color: #F0F2EF;;
}

input[name="shipping"]::placeholder,input[name="shipping"], input[name="dimensions"]::placeholder,input[name="dimensions"], input[name="desc"]::placeholder, input[name="desc"] {
    font-family: Montserrat;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    text-transform: capitalize;
}

.upperhalf {
    display: flex;
    margin: 150px 108px 11px 108px;
}

#Title {

    /* H3 */
    font-family: Montserrat;
    font-size: 32px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 44.8px */
    text-transform: capitalize;

}


input[name="ShortDesc"]::placeholder, input[name="ShortDesc"],input[name="Cost"]::placeholder, input[name="Cost"]{
    
    /* bodyLG */
    font-family: Montserrat;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 180%; /* 32.4px */
    text-transform: capitalize;

}

input[name="Title"] {
    display: flex;
    width: 650px;
    height: 60px;
    flex-direction: row;
    justify-content: center;
    border: 1px solid #CBCBCB;
    
}

input[name="ShortDesc"] {
    display: flex;
    width: 650px;
    height: 60px;
    flex-direction: row;
    justify-content: center;
    border: 1px solid #CBCBCB;
}

input[name="Cost"] {
    margin: 10px 0px 0px 0px;
    display: flex;
    width: 200px;
    height: 40px;
    flex-direction: row;
    justify-content: center;
    border: 1px solid #CBCBCB;
}

#UploadPictures {
    color: #000;
    text-align: center;
    margin: 80px;

    /* bodyLG */
    font-family: Montserrat;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    text-transform: capitalize;
}
.UploadImages {
    border: 1px solid #CFD0CF;
    width: 450px;
    height: 200px;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 0 auto;

}

.AddImages {
    width: 650px;
    height:512px;
    align-items: center;
    background: #F5F5F5;
    display: flex;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}

.titleAndDesc {
    margin: 0px 0px 0px 50px;
    width: 650px;
    display: block;

}
</style><style>

#editButton {
    margin: 20px 0px 0px 0px;
}

.button {
    background-color: #748C70;
    padding: 16px;
    width: 650px;
    color: white;
    font-family: Montserrat;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%; /* 22.4px */
    text-transform: capitalize;
}

.button:hover {
    background-color: #5A6D57;

}
.lowerhalf {
    
    margin: 11px 108px 0px 108px;
    display: flex;
}

.lowerleft {
    width: 650px;
    height:512px;
    align-items: center;
    background-color: #F0F2EF;
    display: block;
}

.lowerright {
    margin: 0px 0px 0px 50px;
    width: 650px;
    height:512px;
    align-items: center;
    display: block;
}

#description {
    height: 200px;
    border: 1px solid #CBCBCB;
    padding: 0px 24px 0px 24px;
    background-color: #F0F2EF;
}

#descTitle {
    color: var(--Black, #0C0C0C);

    /* bodyXL */
    font-family: Montserrat;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 180%; /* 36px */
    text-transform: capitalize;
    border-bottom: 1px solid #CBCBCB;
}

#productdetail {
    height: 28px;
    border: 1px solid #CBCBCB;
    padding: 24px;
    font-family: Montserrat;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    text-transform: capitalize;
}

#dimTitle, #shipTitle {
    color: var(--Primary, #748C70);
    /* H5 */
    font-family: Montserrat;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    text-transform: capitalize;
    
}

#dimension, #shipping {
    display: block;
    height: 215px;
    border: 1px solid #CBCBCB;
    padding: 0px 24px 0px 24px;

}

input[name="shipping"], input[name="dimensions"], input[name="desc"] {
    border: 1px solid #CDD7CF;
    width: 518px;
    height: 76px;
    background-color: #F0F2EF;;
}

input[name="shipping"]::placeholder,input[name="shipping"], input[name="dimensions"]::placeholder,input[name="dimensions"], input[name="desc"]::placeholder, input[name="desc"] {
    font-family: Montserrat;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    text-transform: capitalize;
}

.upperhalf {
    display: flex;
    margin: 150px 108px 11px 108px;
}

input[name="Title"]::placeholder, input[name="Title"] {

    /* H3 */
    font-family: Montserrat;
    font-size: 32px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 44.8px */
    text-transform: capitalize;

}

input::placeholder {
    color: #CDD7CF;
}

input[name="ShortDesc"]::placeholder, input[name="ShortDesc"],input[name="Cost"]::placeholder, input[name="Cost"]{
    
    /* bodyLG */
    font-family: Montserrat;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 180%; /* 32.4px */
    text-transform: capitalize;

}

input[name="Title"] {
    display: flex;
    width: 650px;
    height: 60px;
    flex-direction: row;
    justify-content: center;
    border: 1px solid #CBCBCB;
    
}

input[name="ShortDesc"] {
    display: flex;
    width: 650px;
    height: 60px;
    flex-direction: row;
    justify-content: center;
    border: 1px solid #CBCBCB;
}

input[name="Cost"] {
    margin: 10px 0px 0px 0px;
    display: flex;
    width: 200px;
    height: 40px;
    flex-direction: row;
    justify-content: center;
    border: 1px solid #CBCBCB;
}

#UploadPictures {
    color: #000;
    text-align: center;
    margin: 80px;

    /* bodyLG */
    font-family: Montserrat;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    text-transform: capitalize;
}
.UploadImages {
    border: 1px solid #CFD0CF;
    width: 450px;
    height: 200px;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 0 auto;

}

.AddImages {
    width: 650px;
    height:512px;
    align-items: center;
    background: #F5F5F5;
    display: flex;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}

.titleAndDesc {
    margin: 0px 0px 0px 50px;
    width: 650px;
    display: block;

}

.Not-found{
    display: grid;
    justify-content: center;
    justify-items: center;
}

.return-button{
    background-color: #748C70;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}
</style>
