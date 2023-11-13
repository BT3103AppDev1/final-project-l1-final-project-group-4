<template>
  <div v-if="user" class="products-container">
    <aside class="filters">
      <div v-if="seller" class="add-product-btn">
        <RouterLink :to="'/marketplace/AddProduct'">Add Product</RouterLink>
      </div>
      <div class="search-bar">
        <input v-model="searchTerm" type="text" placeholder="Search for products...">
      </div>
      <div v-if="!seller" class="category-filter">
        <h3>Categories</h3>
        <div v-for="category in categories" :key="category" class="category-checkbox">
          <input type="checkbox" :id="category" :value="category" v-model="selectedCategories">
          <label :for="category">{{ category }}</label>
        </div>
      </div>
    </aside>
    <div class="productlist">
      <div v-for="product in filteredProducts" :key="product.title" class="productcard">
        <RouterLink :to="'/marketplace/product/' + product.id" class="product-link">
          <div class="product-card">
            <div class="product-image-container">
              <img
                :src="product.picture"
                alt="Product Image"
                class="product-card-image"
              />
            </div>
            <div class="product-details">
              <p class="product-title">{{ product.title }}</p>
              <p class="product-description">{{ product.description || 'No description' }}  </p>
              <p class="product-cost">{{ product.cost ? `$${product.cost.toFixed(2)}` : 'Price not available' }}</p>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import firebaseApp from "@/firebase.js";
import {
  setDoc,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  collection,
  getFirestore,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; 

const db = getFirestore();

export default {
  data() {
    return {
      products: [],
      searchTerm: "",
      user: false,
      userDocRef: false,
      seller: false,
      selectedCategories: [],
      categories: ["Reusable Goods", "Renewable Energy", "Organic Materials", "Waste Reduction"],
    };
  },
  computed: {
    filteredProducts() {
      let filtered = this.products;

      // Filter by search term
      if (this.searchTerm) {
        const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
        filtered = filtered.filter(product =>
          product.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          (product.description && product.description.toLowerCase().includes(lowerCaseSearchTerm))
        );
      }

      // Filter by selected categories
      if (this.selectedCategories.length) {
        filtered = filtered.filter(product =>
          product.categories.some(category => this.selectedCategories.includes(category))
        );
      }

      return filtered;
    },
  },




  async mounted() {
  try {
    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        // Make sure this line is within the if(user) block to ensure that user.uid is defined
        this.userDocRef = doc(db, 'Users', this.user.uid);
      }
    });

    const fbproducts = [];
    const alldocs = await getDocs(collection(db, "Products"));
    alldocs.forEach((doc) => {
      const productData = doc.data(); // Renamed to avoid any scope confusion
      fbproducts.push({
        id: doc.id,
        title: productData.title,
        description: productData.desc,
        picture: productData.pictures,
        cost: productData.cost,
        categories: Array.isArray(productData.categories) ? productData.categories : [] 
      });
    });
    this.products = fbproducts;

    if (this.user) { // Ensure that this.user is defined before attempting to access userDocRef
      const userDoc = await getDoc(this.userDocRef);
      if (userDoc.exists()) {
        const userType = userDoc.data().userType;
        if (userType == "Eco-Entrepreneur") {
          this.seller = true;
          const sellerdocs = await getDocs(collection(db, 'Eco-Entrepreneur', this.user.uid, 'Products'));
          const sellerproducts = [];
          sellerdocs.forEach((doc) => {
            const sellerData = doc.data(); // Renamed to avoid any scope confusion
            sellerproducts.push({
              id: doc.id,
              title: sellerData.title,
              description: sellerData.desc,
              picture: sellerData.pictures,
              cost: sellerData.cost
            });
          });
          this.products = sellerproducts;
        }
      }
    }
  } catch (error) {
    console.error("An error occurred in the mounted hook:", error);
  }
},



};
</script>

<style>

.product-link {
  text-decoration: none; 
}

.products-container {
  display: flex;
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  gap: 20px;
}

/* Sidebar filters styling */
.filters {
  flex: 0 0 250px; 
  padding: 20px;
  border-right: 2px solid #748C70;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* Search bar styling */
.search-bar {
  margin-bottom: 30px;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border: 2px solid #748C70;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
}

/* Category filter styling */
.category-filter h3 {
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  align-self: flex-start;
}

.category-checkbox {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

/* Product list styling */
.productlist {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.productcard {
  flex: 0 0 calc(30% - 20px);
  display: flex;
  flex-direction: column;
  margin: 10px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.productcard:hover {
  transform: scale(1.03);
  box-shadow: 0 5px 15px 0 rgba(0,0,0,0.15);
}

/* Individual product card styling */
.product-card {
  padding: 12px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.product-title,
.product-description,
.product-cost {
  text-align: left; 
  width: 100%; 
  text-decoration: none;
}

.product-title,
.product-description {
  max-height: 4.5em; 
  overflow: hidden;
  text-overflow: ellipsis;

}

.product-image-container {
  width: 100%; 
  padding-top: 100%; 
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  background-color: #f5f5f5; 
  margin-bottom: 15px;
}

.product-card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; 
}

.product-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
}

.product-title {
  font-size: 18px;
  margin-bottom: 0px;
  color: #333;
  font-weight: bold;
}

.product-description {
  font-size: 16px;
  margin-bottom: 0px;
  color: #555;
  height: auto;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-cost {
  font-size: 20px;
  font-weight: bold;
  color: #748C70;
  margin-bottom: 0px;
}

/* Add product button styling */
.add-product-btn a {
  background-color: #748c70;
  color: white;
  padding: 12px 16px;
  text-align: center;
  margin-bottom: 30px;
  font-size: 16px;
  font-weight: bold;
  text-decoration: none;
  display: inline-block;
  border-radius: 5px;
}

/* Checkbox styles */
.category-checkbox input {
  margin-right: 5px;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border: 2px solid #748c70;
  border-radius: 5px;
  font-size: 16px;
}
/* Ensure the layout doesn't break on smaller screens */
@media (max-width: 768px) {
  .products-container {
    flex-direction: column;
  }

  .filters {
    flex-direction: row;
    overflow-x: auto;
    white-space: nowrap;
    border-right: none;
    border-bottom: 2px solid #748C70;
    justify-content: center;
  }

  .productcard {
    flex: 0 0 calc(50% - 20px);
  }
}

/* Further responsive adjustments for very small screens */
@media (max-width: 480px) {
  .productcard {
    flex: 0 0 100%; 
  }
}
</style>

