<template>
    
    <div>
        <router-link to="/Forum" class="back-button"> &lt;Back to Forum</router-link>

    <div class="thread-detail">
        <h2>{{ thread.title }}</h2>
        <p>{{ thread.content }}</p>
    </div>
    <br>

     <div class="add-reply-button">
            <router-link :to="`/thread/${threadId}/addreply`">Add Reply</router-link>
    </div>
    <br>

    <div class="reply-count">{{ replies.length }} Replies</div>

      <!-- List of replies -->
    <div v-for="reply in replies" :key="reply.id" class="forum-reply">
    <div class="user-info">
        <!-- You can add user details here if they are associated with the reply -->
        <div class="profile-picture"></div>
        <div class="username">Username Here</div>
    </div>
    <div class="reply-details">
        <div class="title-date">
            <!-- Removed the thread title link since it's a reply -->
            <div class="post-date">Posted on <span class="small-text">{{ reply.timestamp.toDate() }}</span></div>
        </div>
        <!-- Reply content goes here -->
        <div class="description">
            {{ reply.content }}
        </div>
    </div>
    <div class="action-container">
        <!-- You can add action buttons for the reply, like editing or deleting -->
        <button class="delete-button" @click="deleteReply(reply.id)">Delete</button>
    </div>
    </div>
    </div>
</template>

<script>
import { getFirestore, doc, getDoc, collection, onSnapshot, query, orderBy, deleteDoc } from 'firebase/firestore';
import firebase from '@/firebase.js';  // Ensure firebase.js exports the initialized app.

export default {
    props: ['threadId'],
    data() {
        return {
            thread: {},
            replies: []
        };
    },
    async created() {
        const db = getFirestore(firebase);

        // Log the threadId to ensure it's correct
        console.log("Thread ID:", this.threadId);

        // Fetch the thread data
        const threadRef = doc(db, 'threads', this.threadId);
        const threadDoc = await getDoc(threadRef);
        
        if (threadDoc.exists()) {
            this.thread = { id: threadDoc.id, ...threadDoc.data() };
        }

        // Fetch the replies for the thread
        const repliesQuery = query(collection(db, 'threads', this.threadId, 'replies'), orderBy('timestamp', 'desc'));
        
        onSnapshot(repliesQuery, (snapshot) => {
            this.replies = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Log the fetched replies to see them
            console.log("Fetched replies:", this.replies);
        });
    },

    methods: {
        async deleteReply(replyId) {
            const db = getFirestore(firebase);

            try {
                const replyRef = doc(db, 'threads', this.threadId, 'replies', replyId);
                await deleteDoc(replyRef);
                console.log("Reply successfully deleted!");
                // Optionally, you can remove the deleted reply from the `replies` array
                this.replies = this.replies.filter(reply => reply.id !== replyId);
            } catch (error) {
                console.error("Error deleting reply: ", error);
            }
        }
    }
}

</script>

<style scoped>

/* Flex container for the top section */

.reply-count {
    margin-left: 20px;
    font-weight: bold;
}

.thread-detail{
    padding: 8px;
    margin: 20px;
    background-color: #fff;
}

.back-button {
    display: block;
    width: 110px; /* Adjust the width for your desired square size */
    height: 30px; /* Same as width for a square button */
    color: black;
    text-align: left;
    text-decoration: none;
    margin-left: 20px;
    line-height: 30px; 
    }

    .back-button:hover {
        background-color: #e0e0e0;
    }

.add-reply-button a {
    display: block;
    width: 150px; /* Adjust the width for your desired square size */
    height: 30px; /* Same as width for a square button */
    background-color: #738678;
    color: white;
    text-align: center;
    text-decoration: none;
    font-weight: bold;
    margin-left: 20px;
    line-height: 30px; 
}

/* Optional: Hover effect */
.add-reply-button a:hover {
    background-color: darkgreen; /* Change the background color on hover */
}

/* Styling for the forum thread container */
.forum-reply {
    border: 1px solid black;
    border-bottom: 6px solid #ccc;
    padding: 10px;
    margin: 20px;
    background-color: #fff;
    box-shadow: 0px 6px 6px -6px #888;
    display: flex;
    justify-content: space-between;
}


/* Styling for the user information container */
.user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-right: 30px;
}

/* Styling for the profile picture (round) */
.profile-picture {
    width: 60px;
    height: 60px;
    background-color: #000; /* Black dot */
    border-radius: 50%; /* Round profile picture */
    margin-bottom: 5px;
}

/* Styling for the username */
.username {
    font-weight: bold;
}

/* Styling for thread details (title and date) */
.reply-details {
    flex: 1;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

/* Styling for thread title */

/* Styling for post date (small text) */
.title-date {
    font-size: 12px;
    color: #888;
}

.small-text {
    font-size: 12px;
}

/* Styling for thread description */
.description {
    text-align: left; /* Center the description */
    margin-top: 10px;
}

/* This will hold both the delete button and the replies count */
.action-container {
    display: flex;
    align-items: flex-start; /* Align items to the top */
    position: relative;
}

/* Style for the delete button */
.delete-button {
    position: absolute;  /* This allows it to be positioned relative to the action-container */
    top: 0;              /* Align to the top */
    right: 0;            /* Align to the right */
    background-color: #f4f4f4;  /* Background color for the button */
    border: none;        /* Removes any default border */
    padding: 8px 12px;   /* Some padding for visual appeal */
    cursor: pointer;     /* A hand cursor to indicate it's clickable */
    transition: background-color 0.3s;  /* Transition for a smooth color change */
}

/* Change the color on hover for a better UX */
.delete-button:hover {
    background-color: #e0e0e0;
}
</style>