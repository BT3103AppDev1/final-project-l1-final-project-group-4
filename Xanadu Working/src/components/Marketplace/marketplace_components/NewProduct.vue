<script>
import firebaseApp from "@/firebase.js";
import { getFirestore} from "firebase/firestore";
import { setDoc, getDocs, doc, deleteDoc, getDoc} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable, getStorage } from "firebase/storage";


const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export default {
    data() {
        return {
            showfile : false,
            img1 : null,
            imageData: false,
            username: "testuser",
            Title:"",
            ShortDesc:"",
            Shipping:"",
            Dimensions:"",
            Desc:""
        }
    },
    methods : {
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
            alert("Adding new product: "+ this.Title)
            await setDoc(doc(db,'Eco-Entrepreneur',this.username,'Products',this.Title),{
                title: this.Title,
                shortdesc: this.ShortDesc,
                shipping: this.Shipping,
                dimensions: this.Dimensions,
                desc: this.Desc,
                pictures: this.img1
            })
            const docSnap = await getDoc(doc(db,this.username,this.Title))
            console.log(docSnap.data())
            this.$router.push('/Marketplace')
        }
    }
}

</script>

<template>
<div class="upperhalf">
    <div class="AddImages" :style ="{'background-image' : 'url('+img1+')'}">
        <div class="UploadImages">
            <button @click ="triggerInput" id="UploadPictures">Upload Pictures</button>
            <input type="file" 
            ref = "uploadPictures"
            @change="uploadPictures"
            v-show="showfile"
            accept="image/*" >   

        </div>
    </div>
    <div class="titleAndDesc">
        <input v-model="Title" type="text" id="Title" name="Title" placeholder="Title">
        <input v-model="ShortDesc" type="text" id="ShortDesc" name="ShortDesc" placeholder="Short Description">
    </div>
</div>
<div class="lowerhalf">
    <div class="lowerleft">
        <div id="productdetail">Product Detail</div>
        <div id="dimension">
            <h5 id="dimTitle">Dimensions </h5>
            <input v-model="Dimensions" type="text" id="dimInput" name="dimensions" placeholder="Dimensions">
        </div>
        <div id="shipping">
            <h5 id="shipTitle">Shipping and Return</h5>
            <input v-model="Shipping" type="text" id="shipInput" name="shipping" placeholder="Shipping And Return">
        </div>    
    </div>
    <div class="lowerright">
        <div id="description">
            <h5 id="descTitle">Description </h5>
            <input v-model="Desc" type="text" id="descInput" name="desc" placeholder="Description">
        </div>
        <div id="addButton">
            <button @click = "AddProduct" class="button">Add</button>
        </div>
    </div>
</div>
</template>

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

input[name="ShortDesc"]::placeholder, input[name="ShortDesc"] {
    
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
</style>