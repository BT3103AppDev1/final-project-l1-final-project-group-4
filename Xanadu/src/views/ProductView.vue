<template>
  <div class="product-view">
    <div class="product-content">
      <img :src="product.picture" alt="Product Image" class="product-view-image">
      <h2 class="product-title">{{ product.title }}</h2>
      <p class="product-description">{{ productDescription }}</p>
      <p class="product-cost">{{ product.cost ? `$${product.cost}` : 'Price not available' }}</p>
      <div class="quantity-input">
        <label for="quantity">Quantity:</label>
        <input v-model="quantity" type="number" id="quantity" min="1">
      </div>
      <!-- Add v-if for user-type = Green Ranger -->
      <div class="buttons">
        <div class="add-cart-btn">
          <button @click="addToCart(product, quantity)" class="cart-btn">Add to Cart</button>
        </div>
        <div class="edit-product-btn">
          <!-- Add v-if for user-type = Eco-Entrepreneur -->
          <RouterLink :to="'/marketplace/product/' + product.id + '/edit'">Edit Product</RouterLink> 
        </div>
        <div class = "delete-button">
          <Button class="del-product-btn" icon="pi pi-times" severity="danger" rounded aria-label="Cancel" @click = "deleteProduct(product.title)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFirestore, doc, getDoc, collection, addDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

export default {
  props: {
    id: String
  },
  data() {
    return {
      product: {},
      quantity: 1
    };
  },
  computed: {
    productDescription() {
      return this.product.description || "No description";
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
            cost: productData.cost
          };
        });
      } else {
        console.error("Product not found!");
        next(false);
      }
    }).catch((error) => {
      console.error("Error fetching product:", error);
      next(false);
    });
  },
  methods: {

    // need to add function to delete from user collection as well
    async deleteProduct(productTitle) {
      alert("Deleting " + productTitle);
      await deleteDoc(doc(db, 'Products', productTitle));
      this.$router.push('/Marketplace');
    },

    async addToCart(product, quantityToAdd) {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        alert("You must be logged in to add items to the cart.");
        return;
      }

      const cartRef = collection(db, 'Eco-Entrepreneur', currentUser.uid, 'Cart');
      
      // Check if the product is already in the cart
      const productInCart = (await getDocs(cartRef)).docs.find(doc => doc.data().title === product.title);

      if (productInCart) {
        // Update the quantity of the existing product in the cart
        const updatedQuantity = productInCart.data().quantity + quantityToAdd;
        await updateDoc(doc(cartRef, productInCart.id), { quantity: updatedQuantity });
        alert("Updated quantity in cart!");
      } else {
        // Add the product as a new entry to the cart
        const productToAdd = {
          title: product.title || "No title",
          picture: product.picture,
          description: this.productDescription,
          quantity: quantityToAdd,
          cost: product.cost
        };

        await addDoc(cartRef, productToAdd);
        alert("Added to cart!");
      }
    },
    EditProduct(product) {
      console.log("Edit Product: ", product);
    }
  }
}
</script>

  
  <style>
  .product-cost {
  font-size: 22px; /* Adjust the font size as needed */
  font-weight: bold;
  color: #748C70; /* Match the color with your theme */
  margin-bottom: 20px; /* Some space below the cost for separation */
  }
  .product-view {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
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
    margin: 10px;
    background-color: #748C70;
    color: white;
    border: none;
    padding: 12px 24px; /* Increased padding */
    font-size: 18px; /* Increased font size */
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .edit-product-btn a {
    background-color: #748C70;
    color: white;
    border: none;
    padding: 12px 24px; /* Increased padding */
    font-size: 18px; /* Increased font size */
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-family: Montserrat;
    font-size: 16px;
    font-weight: 700;
    line-height: 140%;
    text-decoration: none;

  }

  .del-product-btn {
    margin: 10px;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    align-content: space-between;
  }

  
  .cart-btn:hover, .edit-product-btn a:hover {
    background-color: #657B61; /* Darken the button color on hover */
  }

  </style>
  