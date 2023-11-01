<template>
    <div class="add-reply-container">
        <h2 class="reply-title">Add Reply</h2>
        <textarea class="reply-textarea" v-model="content" placeholder="Write your reply..."></textarea>
        <button class="submit-button" @click="submitReply">Submit</button>
    </div>
</template>

<script>
import { getFirestore, addDoc, collection, doc, getDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseApp from '@/firebase.js';

export default {
    props: ['threadId', 'userType', 'userId'],
    data() {
        return {
            content: '',
            firstName: '',
            lastName: '',
            timestamp: null,
            replyuserId: '',
        };
    },
    computed: {
        loggedInUserId() {
            const auth = getAuth(firebaseApp);
            return auth.currentUser ? auth.currentUser.uid : null; // Logged-in user's userId
        }
    },
    methods: {
        async fetchLoggedInUserName() {
            const db = getFirestore(firebaseApp);

            // Attempt to fetch from Green Rangers collection
            let userRef = doc(db, "Green Rangers", this.loggedInUserId);
            let userSnapshot = await getDoc(userRef);

            // If not found in Green Rangers, attempt to fetch from Eco-Entrepreneur collection
            if (!userSnapshot.exists()) {
                userRef = doc(db, "Eco-Entrepreneur", this.loggedInUserId);
                userSnapshot = await getDoc(userRef);
            }

            if (userSnapshot.exists()) {
                this.firstName = userSnapshot.data().firstName || "N/A";  // Added default value for debugging
                this.lastName = userSnapshot.data().lastName || "N/A";    // Added default value for debugging

                console.log(`Fetched user data:`, userSnapshot.data());   // Debug log
            } else {
                console.warn(`User document for ID ${this.loggedInUserId} not found in either collection`);  // Debug warning
            }
        }
        ,
        async submitReply() {
            if (!this.loggedInUserId || !this.userType || !this.userId) {
                console.error("User not authenticated or userType/author not identified");
                return;
            }

            await this.fetchLoggedInUserName(); // Fetch the user's name

            if (!this.content.trim()) {
                alert("Reply content cannot be empty.");
                return;
            }

            const db = getFirestore(firebaseApp);
            const repliesCollectionRef = collection(db, this.userType, this.userId, 'threads', this.threadId, 'replies');

            try {
                await addDoc(repliesCollectionRef, {
                    content: this.content.trim(),
                    timestamp: Timestamp.fromDate(new Date()),
                    replyuserId: this.loggedInUserId,
                    firstName: this.firstName,
                    lastName: this.lastName
                });

                console.log('Reply added successfully');
                this.content = ''; // Clear the content after successful addition
            } catch (error) {
                console.error(`Error adding reply:`, error);
            }

            this.$router.go(-1); // Navigate back
        }
    }
}
</script>




<style scoped>
.add-reply-container {
    background-color: #738678;
    /* Xanadu color */
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* Centers the child elements */
}

h2 {
    font-size: 28px;
    margin-bottom: 20px;
    color: white;
    font-weight: bold;
    text-align: center;
}

textarea {
    width: 90%;
    /* Reduce width for some padding effect */
    padding: 12px;
    border: 2px solid #5a605c;
    border-radius: 7px;
    font-size: 16px;
    color: #333;
    background-color: #e8e9e7;
    transition: border-color 0.3s ease;
    height: 100px;
    margin-bottom: 20px;
}

textarea:focus {
    outline: none;
    border-color: #454f4b;
}

button {
    padding: 10px 20px;
    font-size: 18px;
    color: #738678;
    /* Xanadu color */
    background-color: white;
    border: 2px solid #738678;
    border-radius: 7px;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover {
    background-color: #e8e9e7;
    color: #454f4b;
}
</style>