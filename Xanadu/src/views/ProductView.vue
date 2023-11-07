<template>
  <div class="product-view">
    <div class="product-content">
      <div class="product-left">
        <img :src="product.picture" alt="Product Image" class="product-view-image">
      </div>
      <div class="product-right">
        <h2 class="product-title">{{ product.title }}</h2>
        <div class="product-details">
          <!-- Removed duplicate detail-section div -->
          <div class="detail-section">
            <h3>Categories:</h3>
            <ul class="product-categories">
              <li v-for="category in product.categories" :key="category">{{ category }}</li>
            </ul>
          </div>
          <div class="detail-section">
            <h3>Description:</h3>
            <p class="product-description">{{ productDescription }}</p>
          </div>
          <div class="detail-section">
            <h3>Short Description:</h3>
            <p>{{ product.shortdesc }}</p>
          </div>
          <div class="detail-section">
            <h3>Shipping:</h3>
            <p>{{ product.shipping }}</p>
          </div>
          <div class="detail-section">
            <h3>Dimensions:</h3>
            <p>{{ product.dimensions }}</p>
          </div>
          <div class="detail-section">
            <h3>Price:</h3>
            <p class="product-cost">{{ product.cost ? `$${product.cost}` : 'Price not available' }}</p>
          </div>
          <div class="detail-section">
            <h3>Seller:</h3>
            <p>{{ product.seller }}</p>
          </div>
        </div>
        <div class="actions-section">
          <div v-if="userType !== 'Eco-Entrepreneur'" class="quantity-input">
            <label for="quantity">Quantity:</label>
            <input v-model="quantity" type="number" id="quantity" min="1">
          </div>
          <div class="buttons">
            <div v-if="userType === 'Green Ranger'" class="add-cart-btn">
              <button @click="addToCart(product, quantity)" class="cart-btn">Add to Cart</button>
            </div>
            <div v-if="userType === 'Eco-Entrepreneur'" class="product-buttons">
              <RouterLink :to="'/marketplace/product/' + product.id + '/edit'" class="edit-btn">Edit Product</RouterLink>
              <Button class="del-product-btn" icon="pi pi-times" severity="danger" rounded aria-label="Cancel" @click="deleteProduct(product.title)"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebaseApp from "@/firebase.js";
import { getFirestore, doc, getDoc, collection, addDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";  // 1. Import required functions


const db = getFirestore();
const auth = getAuth();

export default {
  props: {
    id: String
  },
  data() {
    return {
      userType: null,
      product: {},
      quantity: 1,
      seller: false,
      user : false,
      userDocRef: false
    };
  },
  async created() {
      const user = auth.currentUser;
      if (user) {
      this.userType = await this.determineUserType(user);
    }
  },
  computed: {
    productDescription() {
      return this.product.description || "No description";
    }
  },
  
  beforeRouteEnter(to, from, next) {
    console.log(to.params.id);
    const productRef = doc(db, 'Products', to.params.id);
    getDoc(productRef).then((productDoc) => {
      if (productDoc.exists) {
        const productData = productDoc.data();
        next(vm => {
          vm.product = {
            id: productDoc.id,
            title: productData.title,
            shortdesc: productData.shortdesc,
            shipping: productData.shipping,
            dimensions: productData.dimensions,
            description: productData.desc,
            picture: productData.pictures,
            cost: productData.cost,
            seller: productData.username,
            categories: productData.categories,
            uid: productData.uid,
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
  async mounted() {
    try {
      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;
      this.user = user;
      console.log(this.user);
      const userDocRef = doc(db, 'Users', this.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        console.log("Document data:", userDoc.data());
      } else {
        console.log("No such document!")
      }
      const userType = userDoc.data().userType;
      console.log(userType);
      if (this.user && userType == "Eco-Entrepreneur") {
        this.seller = true;
        console.log("a seller");
      }
    } catch(error) {
      console.log(error);
    }
    },
  methods: {
    async determineUserType(user) {
      const ecoEntrepreneurDocRef = doc(db, "Eco-Entrepreneur", user.uid);
      const ecoEntrepreneurDocSnap = await getDoc(ecoEntrepreneurDocRef);

      if (ecoEntrepreneurDocSnap.exists()) {
        return "Eco-Entrepreneur";
      } else {
        const greenRangersDocRef = doc(db, "Green Rangers", user.uid);
        const greenRangersDocSnap = await getDoc(greenRangersDocRef);

        if (greenRangersDocSnap.exists()) {
          return "Green Ranger";
        }
      }
      return null; // Or some default userType
    },
    // need to add function to delete from user collection as well
    async deleteProduct(productId) {
        try {
            this.$toast.add({
                severity: "info",
                summary: "Deleting Product",
                life: 6000,
            });

            // Delete from the main 'Products' collection
            await deleteDoc(doc(db, 'Products', productId));

            // Check if userType and currentUser are available
            if (this.userType && auth.currentUser) {
                // Delete from the seller's 'Products' sub-collection using userType and current user's UID
                await deleteDoc(doc(db, this.userType, auth.currentUser.uid, 'Products', productId));
            } else {
                throw new Error("User type or current user UID not found");
            }

            this.$toast.add({
                severity: "success",
                summary: "Deleted Product",
                life: 6000,
            });

            this.$router.push('/Marketplace');
        } catch (error) {
            console.error("Error deleting product:", error);
            this.$toast.add({
                severity: "error",
                summary: "Error deleting product",
                detail: error.message,
                life: 6000,
            });
        }
    },

    async addToCart(product, quantityToAdd) {
      const currentUser = auth.currentUser;
      const userType = await this.determineUserType(auth.currentUser);
      const cartRef = collection(db, 'Green Rangers', currentUser.uid, 'Cart');
      console.log("Adding to cart:", product.title, "Quantity:", quantityToAdd); // Debugging line

      if (!currentUser) {
        console.error("No current user found.");
        alert("You must be logged in to add items to the cart.");
        return;
      }

      if (!product.seller) {
        console.error("Seller information is missing from the product details.");
        return;
      }
  
      try {
        const cartSnapshot = await getDocs(cartRef);
        const productInCart = cartSnapshot.docs.find(doc => doc.data().title === product.title);

        if (productInCart) {
          const updatedQuantity = productInCart.data().quantity + quantityToAdd;
          console.log("Product already in cart. Updating quantity:", updatedQuantity); // Debugging line
          await updateDoc(doc(cartRef, productInCart.id), { quantity: updatedQuantity });
          alert("Updated quantity in cart!");
        } else {
          const productToAdd = {
            title: product.title,
            picture: product.picture,
            description: product.description || "No description",
            quantity: quantityToAdd,
            cost: product.cost,
            seller: product.seller, // Make sure this is correctly sourced
            categories: product.categories,
            uid: product.uid,
          };

          console.log("Product not in cart. Adding new item:", productToAdd); // Debugging line
          await addDoc(cartRef, productToAdd);
          alert("Added to cart!");
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Failed to add to cart!");
      }
    },


    EditProduct(product) {
      console.log("Edit Product: ", product);
    }
  }
}
</script>

  
<style>
.product-categories {
  list-style-type: none;
  padding: 0;
}

.product-categories li {
  background-color: #eff5f5;
  display: inline-block;
  margin-right: 10px;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 0.9rem;
  color: #333;
}

.product-view {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 50px 20px;
  min-height: 100vh;
  background-color: #f9f9f9;
  color: #333;
  font-family: 'Arial', sans-serif;
}

.product-content {
  background: #fff;
  padding: 25px;
  max-width: 1200px;
  border-radius: 15px;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.product-left,
.product-right {
  flex: 1 1 300px;
}

.product-view-image {
  max-width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 10px;
}

.product-title {
  font-size: 28px;
  margin-bottom: 15px;
  font-weight: 600;
}

h3 {
  color: #4a7c59;
  margin-top: 20px;
}

.product-description,
.detail-section p {
  font-size: 16px;
  line-height: 1.6;
  color: #555;
}

.cart-btn,
.edit-product-btn a,
.edit-btn,
.del-product-btn {
  padding: 15px 20px;
  font-size: 16px;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.cart-btn:hover,
.edit-product-btn a:hover,
.edit-btn:hover,
.del-product-btn:hover {
  box-shadow: 4px 6px 12px rgba(0, 0, 0, 0.15);
  transform: scale(1.05);
}

.quantity-input input {
  font-family: inherit;
}

.detail-section {
  border-top: 1px solid #eaeaea;
  padding-top: 15px;
}

.product-buttons {
  display: flex;
  gap: 15px;
  align-items: center;
}

.edit-btn {
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border: none;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: #45a049;
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
    margin: 20px;
  }
.del-product-btn {
  background-color: #f44336;
  color: white;
  text-decoration: none;
  border: none;
  cursor: pointer;
}

.del-product-btn:hover {
  background-color: #da190b;
}

@media (max-width: 768px) {
  .product-content {
    flex-direction: column;
  }

  .product-left,
  .product-right {
    width: 100%;
  }
}

</style>

  