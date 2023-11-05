<template>
  <div class="product-view">
    <div class="product-content">
      <div class="product-left">
        <img :src="product.picture" alt="Product Image" class="product-view-image">
      </div>
      <div class="product-right">
        <h2 class="product-title">{{ product.title }}</h2>
        <div class="product-details">
          <div class="detail-section">
            <div class="detail-section">
            <h3>Categories:</h3>
            <ul class="product-categories">
              <li v-for="category in product.categories" :key="category">{{ category }}</li>
            </ul>
          </div>
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
      quantity: 1,
      userType: null
    };
  },
  async created() {
      const user = auth.currentUser;

      if (user) {
          const ecoEntrepreneurDocRef = doc(db, "Eco-Entrepreneur", user.uid);
          const ecoEntrepreneurDocSnap = await getDoc(ecoEntrepreneurDocRef);

          if (ecoEntrepreneurDocSnap.exists()) {
              this.userType = "Eco-Entrepreneur";
          } else {
              const greenRangersDocRef = doc(db, "Green Rangers", user.uid);
              const greenRangersDocSnap = await getDoc(greenRangersDocRef);

              if (greenRangersDocSnap.exists()) {
                  this.userType = "Green Ranger";
              }
          }
      }
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
            shortdesc: productData.shortdesc,
            shipping: productData.shipping,
            dimensions: productData.dimensions,
            description: productData.desc,
            picture: productData.pictures,
            cost: productData.cost,
            seller: productData.username,
            categories: productData.categories,
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

  