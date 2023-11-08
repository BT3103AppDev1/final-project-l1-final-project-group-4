<template>
    <h1>THIS IS Profile Page</h1>

    <div class="info_box">
        <div class="product-image-container">
            <img :src="profilePicture" alt="Product Image" class="product-card-image">
        </div>
        <span>First Name: {{firstName}}</span>
        <span>Last Name: {{lastName}}</span>
        <span>Email: {{email}}</span>
        <span>Account Type: {{userType}}</span>
    </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; 

const db = getFirestore();

// const user = auth.currentUser;

export default {
    data(){
        return{
            firstName: "",
            lastName: "",
            email: "",
            userType: "",
            profilePicture: null,
        }
    },

    async beforeMount(){
        const auth = getAuth();

        await onAuthStateChanged(auth, (user) => {
            if(user){
                // console.log("user:", user)
                const userDocRef = doc(db, "Users", user.uid)
                // console.log("userDocRef: ", userDocRef)
                const userDoc = getDoc(userDocRef)

                userDoc.then((userDoc) => {
                    // console.log("userDoc: ", userDoc)
                    const userInfo = userDoc.data()
                    // console.log("userInfo: ",userInfo)


                    this.firstName = userInfo.firstName
                    this.lastName = userInfo.lastName
                    this.email = userInfo.email
                    this.userType = userInfo.userType
                    this.profilePicture = userInfo.profilePicture
                })
            }
        })
    }
}
</script>

<style scoped>
span{
    display: block;
}
</style>