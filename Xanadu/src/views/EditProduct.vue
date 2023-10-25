<template>
    <div class="upperhalf">
        <div class="AddImages" :style ="{'background-image' : 'url('+product.picture+')'}">
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
            <input v-model="Title" type="text" id="Title" name="Title" :placeholder="product.title">
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
</style>
<script>
  import { getFirestore, doc, getDoc, collection, addDoc } from "firebase/firestore";
  
  const db = getFirestore();
export default {
    data() {
      return {
        product: {},
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
            description: productData.desc,
            picture: productData.pictures,
            shipping: productData.shipping,
            dimensions: productData.dimensions,
            shortdesc: productData.shortdesc,
            cost: productData.cost
          };
        });
      });
    },
    methods: {
        Update() {
            console.log('Updating product: '+ product.title)
        }
    }
}

</script>