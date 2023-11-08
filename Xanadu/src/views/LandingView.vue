<template>
<h1>hi</h1>
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
.profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
}

.info-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background: #fff; /* Change as needed */
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    max-width: 350px; /* Adjust as needed */
    width: 100%; /* Responsive width */
    margin: auto;
}

.image-container {
    margin-bottom: 20px;
}

.profile-image {
    width: 150px; /* Adjust size as needed */
    height: 150px; /* Adjust size as needed */
    border-radius: 50%;
    object-fit: cover;
}

.user-details span {
    display: block;
    margin: 10px 0; /* Adjust the spacing as needed */
    text-align: center; /* Ensures text is centered */
    width: 100%; /* Ensures span takes the full width */
}

h1 {
    margin-bottom: 20px; /* Adjust the spacing as needed */
}
</style>