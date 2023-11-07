<template>
    <div class="products">
      <img class="productimage" src="@/assets/products page.png">
      <div class="add-product-btn">
        <RouterLink to="AddProduct">Add Product</RouterLink>
      </div>
  
      <div class="productlist">
        <div v-for="product in products" :key="product.title" class="productcard">
          <RouterLink :to="'/product/' + product.id">
            <div class="product-card">
              <div class="product-image-container">
                <img :src="product.picture" alt="Product Image" class="product-card-image">
              </div>
              <div class="product-details">
                <p class="product-title">{{ product.title }}</p>
                <p class="product-description">{{ product.Desc || 'No description' }}</p>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </template>
  
  <style>
  .productlist {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 20px; /* Provides even spacing between the cards. Can replace margin-right and margin-bottom. */
  }
  
  .productcard {
    flex: 0 0 calc(33.33% - 20px);
    box-sizing: border-box;
    padding: 5px;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .productcard:hover {
    transform: translateY(-5px); /* Lift card slightly on hover for a nice effect */
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15); /* Increase shadow depth on hover */
  }
  
  .product-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    border: 2px solid #748C70;
    text-align: center;
    border-radius: 10px;
  }
  
  .product-image-container {
    width: 200px; /* Set a fixed width for the square container */
    height: 200px; /* Set a fixed height for the square container */
    overflow: hidden; /* Hide any overflow */
  }
  
  .product-card-image {
    width: 100%;
    height: 100%; /* Make the image fill the square container */
    object-fit: cover; /* Ensures image retains aspect ratio but fills space */
    border-radius: 10px; /* Rounded edges for the image */
  }
  
  .product-details {
    width: 100%;
  }
  
  .product-title {
    font-size: 18px;
    margin-bottom: 10px;
    color: #333; /* Darker text for readability */
  }
  
  .product-description {
    font-size: 16px;
    margin: 10px 0; /* Add some spacing above and below the description */
    line-height: 1.5;
    color: #555; /* Darker text for readability */
  }
  
  .products {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .productimage {
    width: 100%;
    margin-bottom: 20px;
  }
  
  .add-product-btn a {
    background-color: #748C70;
    color: white;
    width: 250px;
    padding: 16px;
    text-align: center;
    margin-bottom: 20px;
    font-family: Montserrat;
    font-size: 16px;
    font-weight: 700;
    line-height: 140%;
    text-transform: capitalize;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  </style>
  
  <script>
  import firebaseApp from "@/firebase.js";
  import { getFirestore, getDocs, collection } from "firebase/firestore";
  
  const db = getFirestore(firebaseApp);
  
  export default {
    data() {
      return {
        username: "testuser",
        products: [],
      };
    },
    async mounted() {
      const fbproducts = [];
      const alldocs = await getDocs(collection(db, 'Eco-Entrepreneur', this.username, 'Products'));
      
      alldocs.forEach((doc) => {
        fbproducts.push({
          id: doc.id,
          title: doc.data().title,
          description: doc.data().Desc,
          picture: doc.data().pictures,
        });
      });
      this.products = fbproducts;
    },
  };
  </script>
  