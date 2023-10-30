<template>
    <div class="adding">
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
            userType: null  // To store whether the user is a Green Ranger or Eco-Entrepreneur
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
                    timestamp: new Date()
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

.adding{
    margin-top: 50px;
}

.adding .description{
    width: 100%;
    min-height: 100px;
    padding: 10px;
    margin-block: 10px;
}

.adding .title{
    width: 100%;
    padding: 8px;
    margin-block: 10px;
}
</style>