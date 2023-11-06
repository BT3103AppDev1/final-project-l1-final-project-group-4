<template>
    <div class="adding">
        <h2 class="reply-title">Add Thread</h2>
        <form @submit.prevent="addThread">
            <div class="title">
            <input v-model="threadTitle" placeholder="Thread Title" type="text" required />
            </div>

            <div class="description">
            <textarea v-model="threadContent" placeholder="Write your thread here..." required></textarea>
            </div>
            <button type="submit">Submit</button>
        </form>
    </div>
</template>

<script>
import { getFirestore, addDoc, collection, doc, getDoc } from "firebase/firestore";

import { getAuth } from "firebase/auth";

export default {
    data() {
        return {
            threadTitle: '',
            threadContent: '',
            db: null,  // Added this property to cache the Firestore instance
            userType: null, // To store whether the user is a Green Ranger or Eco-Entrepreneur
            userID: null
        };
    },
    async created() {
    this.db = getFirestore();  // Initialize Firestore instance on component creation

    // Assuming that the user's type is stored in their document, retrieve it:
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
        const userDocRef = doc(this.db, 'Green Rangers', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            this.userType = 'Green Rangers';
        } else {
            const userDocEcoRef = doc(this.db, 'Eco-Entrepreneur', currentUser.uid);
            const userDocEco = await getDoc(userDocEcoRef);
            if (userDocEco.exists()) {
                this.userType = 'Eco-Entrepreneur';
            }
        }
    }
}
,
    methods: {
        async addThread() {
            try {
                const thread = {
                    title: this.threadTitle,
                    content: this.threadContent,
                    timestamp: new Date(),
                    userType: this.userType, 
                    userID: getAuth().currentUser.uid
                };

                if (!this.userType) {
                    console.error("User type not identified");
                    return;
                }

                // Add thread to the correct sub-collection based on user type
                await addDoc(collection(this.db, this.userType, getAuth().currentUser.uid, 'threads'), thread);
                this.$router.push('/forum');
            } catch (error) {
                console.error("Error adding thread: ", error);
            }
        }
    }
}
</script>


<style scoped>
.adding {
    background-color: #738678; /* Xanadu color */
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 50px auto; /* Updated from margin-top */
    display: flex;
    flex-direction: column;
    align-items: center; /* Centers the child elements */
}

.adding .title, .adding .description {
    width: 500px; /* Reduce width for some padding effect */
    padding: 8px;
    border: 2px solid #5a605c;
    border-radius: 7px;
    font-size: 16px;
    color: #333;
    background-color: #e8e9e7;
    transition: border-color 0.3s ease;
    margin-bottom: 20px;
}

.adding .description {
    height: 150px; /* Specific height for the description textarea */
}

.adding .title input, .adding .description textarea {
    width: 100%; /* Full width within the container */
    border: none; /* Remove individual border as it's set on the container */
    outline: none; /* Remove focus outline */
    background-color: transparent; /* Transparent background */
    font-size: 16px; /* Font size */
    color: #333; /* Text color */
}

.adding .title input::placeholder,
.adding .description textarea::placeholder {
    font-family: 'Your Font Family', sans-serif; /* Replace with your desired font family */
    font-size: 16px; /* Specify the font size you want for the placeholder */
    color: #999999; /* Placeholder text color, change as needed */
    opacity: 1; /* Make sure the placeholder is fully visible */
}

h2 {
    font-size: 28px;
    margin-bottom: 20px;
    color: white;
    font-weight: bold;
    text-align: center;
}

button {
    padding: 10px 20px;
    font-size: 18px;
    color: #738678; /* Xanadu color */
    background-color: white;
    border: 2px solid #738678;
    border-radius: 7px;
    cursor: pointer;
    transition: all 0.3s ease;
    align-self: center;
    width: auto; /* Allow the button to size according to its content */
}

button:hover {
    background-color: #e8e9e7;
    color: #454f4b;
}
</style>
