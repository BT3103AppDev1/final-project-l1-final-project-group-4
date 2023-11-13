<template>
  <div>
    <br />

    <Button
      label="Back to Forum"
      icon="pi pi-arrow-left"
      style="
        background-color: #738678;
        color: White;
        margin-left: 1vw;
        margin-top: 1vh;
        padding-top: 0.5vh;
        padding-bottom: 0.7vh;
        border-radius: 0;
        font-weight: bold;
      "
      @click="backToForum"
    />

    <div class="forum-thread">
      <div class="user-info">
        <div class="profile-pic-username-container">
          <div class="profile-picture">
            <img
              :src="threadUser.profilePicture"
              alt="User's profile picture"
              class="user-profile-img"
            />
          </div>
          <div class="username">
            {{ threadUser.firstName }} {{ threadUser.lastName }}
          </div>
        </div>
      </div>
      <div class="thread-details">
        <div class="title-date-forum">
          <div class="thread-title">
            <b>{{ thread.title }}</b>
          </div>
          <!-- Date can be formatted for better appearance -->
          <div class="post-date">
            Posted on
            <span class="small-text">{{ thread.timestamp.toDate() }}</span>
          </div>
        </div>
        <!-- Additional details or description can go here -->
        <div class="description">
          {{ thread.content }}
        </div>
      </div>
    </div>
    <br />
    <Toast ref="toast" position="top-right" />

    <!-- Dialog for deletion confirmation -->
    <Dialog
      v-model:visible="deleteReplyDialog"
      :style="{ width: '450px' }"
      header="Confirm Deletion"
      :modal="true"
      class="p-fluid"
    >
      <p>Are you sure you want to delete this reply?</p>

      <template #footer>
        <Button
          label="No"
          @click="deleteReplyDialog = false"
          class="p-button-text"
        />
        <Button
          label="Yes"
          @click="confirmDeleteReply"
          class="p-button-danger"
        />
      </template>
    </Dialog>
    <div class="add-reply-button">
      <router-link
        :to="{
          name: 'AddReply',
          params: {
            threadId: threadId,
            userType: thread.userType,
            userId: thread.userId,
          },
        }"
        >Add Reply</router-link
      >
    </div>

    <br />

    <div class="reply-count">{{ replies.length }} Replies</div>

    <!-- List of replies -->
    <div v-for="reply in replies" :key="reply.id" class="forum-reply">
      <div class="user-info">
        <!-- You can add user details here if they are associated with the reply -->
        <div class="profile-pic-username-container">
          <div class="profile-picture">
            <img
              :src="reply.profilepic"
              alt="User's profile picture"
              class="user-profile-img"
            />
          </div>
          <div class="username">{{ reply.firstName }} {{ reply.lastName }}</div>
          <!-- Modified line -->
        </div>
      </div>
      <div class="reply-details">
        <div class="title-date">
          <!-- Removed the thread title link since it's a reply -->
          <div class="post-date">
            Posted on
            <span class="small-text">{{ reply.timestamp.toDate() }}</span>
          </div>
        </div>
        <!-- Reply content goes here -->
        <div class="description">
          {{ reply.content }}
        </div>
      </div>
      <div class="action-container" v-if="check === reply.replyuserId">
        <!-- Conditionally display the delete button if the logged-in user's ID matches the userID of the reply -->
        <Button
          icon="pi pi-trash"
          outlined
          rounded
          severity="danger"
          @click="promptDeleteReply(reply.id)"
          style="margin: 5px"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import firebase from "@/firebase.js";
import { getAuth } from "firebase/auth";
import Toast from "primevue/toast"; // Import the Toast component
import Dialog from "primevue/dialog"; // Import the Dialog component
import Button from "primevue/button"; // Import the Button component for the dialog

export default {
  props: ["threadId", "userId", "userType"],
  components: {
    Toast,
    Dialog,
    Button, // Register the components
  },
  data() {
    return {
      thread: {},
      replies: [],
      toast: null, // Create a reference for the Toast
      deleteReplyDialog: false, // For the visibility of the confirmation dialog
      replyIdToDelete: null, // To temporarily store the reply ID for deletion
      check: null,
      threadUser: null,
    };
  },
  async created() {
    const db = getFirestore(firebase);

    const auth = getAuth();
    const currentUser = auth.currentUser;
    this.check = getAuth().currentUser.uid;
    console.log("Logged-in user ID:", this.check);

    // Fetch the thread data based on userType, userId, and threadId
    const threadRef = doc(
      db,
      this.userType,
      this.userId,
      "threads",
      this.threadId
    );
    const threadDoc = await getDoc(threadRef);

    if (threadDoc.exists()) {
      this.thread = { id: threadDoc.id, ...threadDoc.data() };
    }

    // Fetch the replies for the thread based on the hierarchy
    const repliesQuery = query(
      collection(
        db,
        this.userType,
        this.userId,
        "threads",
        this.threadId,
        "replies"
      ),
      orderBy("timestamp", "desc")
    );

    onSnapshot(repliesQuery, (snapshot) => {
      this.replies = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Log the fetched replies to see them
      console.log("Fetched replies:", this.replies);
    });

    setTimeout(() => {
      console.log(
        "Direct test:",
        this.replies[0] ? this.replies[0].firstName : "No userID"
      );
    }, 3000);

    const userRef = doc(db, this.userType, this.userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      this.threadUser = { id: userDoc.id, ...userDoc.data() };
    }
  },

  methods: {
    backToForum() {
      this.$router.push("/forum");
    },
    promptDeleteReply(replyId) {
      this.replyIdToDelete = replyId; // Store the ID temporarily
      this.deleteReplyDialog = true; // Show the confirmation dialog
    },
    async confirmDeleteReply() {
      const db = getFirestore(firebase);

      if (this.replyIdToDelete) {
        try {
          const replyRef = doc(
            db,
            this.userType,
            this.userId,
            "threads",
            this.threadId,
            "replies",
            this.replyIdToDelete
          );

          this.$refs.toast.add({
            severity: "error",
            summary: "Deleting Reply...",
            life: 3000,
          });

          await deleteDoc(replyRef);

          console.log("Reply successfully deleted!");

          this.$refs.toast.add({
            severity: "success",
            summary: "Reply Deleted!",
            life: 3000,
          });
        } catch (error) {
          console.error("Error deleting reply: ", error);

          this.$refs.toast.add({
            severity: "error",
            summary: "Error deleting reply!",
            detail: error.message,
            life: 5000,
          });
        } finally {
          this.replyIdToDelete = null; // Reset the temporary ID
          this.deleteReplyDialog = false; // Close the confirmation dialog
        }
      }
    },
  },
};
</script>

<style scoped>
.forum-thread {
  border: 1px solid black;
  /* Black border */
  border-bottom: 6px solid #ccc;
  /* Grey shadow at the bottom */
  padding: 10px;
  margin: 20px;
  background-color: #fff;
  box-shadow: 0px 6px 6px -6px #888;
  /* Grey shadow at the bottom */
  display: flex;
  justify-content: space-between;
  position: relative;
  /* Distribute content horizontally */
}

/* Styling for the user information container */
.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* Align items to the left side */
  text-align: left;
  /* Align text to the left */
  margin-right: 30px;
  width: 100px;
  /* You can adjust the width based on your layout needs */
}

.thread-details {
  flex: 1;
  /* Grow to fill available space */
  padding: 0 10px;
  /* Add some spacing */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* Align title and date to the left */
  justify-content: center;
}

/* Styling for thread title */
.thread-title {
  font-size: 20px;
  text-align: left;
  /* Align the title to the left */
}

/* Styling for post date (small text) */
.post-date {
  font-size: 12px;
  color: #888;
}

.small-text {
  font-size: 12px;
}

/* Styling for thread description */
.description {
  text-align: left;
  /* Center the description */
  margin-top: 10px;
}

.reply-count {
  margin-left: 20px;
  font-weight: bold;
}

.thread-detail {
  padding: 8px;
  margin: 20px;
  background-color: #fff;
}

.back-button {
  display: block;
  width: 120px;
  /* Adjust the width for your desired square size */
  height: 30px;
  /* Same as width for a square button */
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
  width: 150px;
  /* Adjust the width for your desired square size */
  height: 30px;
  /* Same as width for a square button */
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
  background-color: darkgreen;
  /* Change the background color on hover */
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

  border-radius: 50%;
  margin-bottom: 5px;
}

.profile-pic-username-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-picture img {
  width: 100%;
  /* Make the image fill the container */
  height: 100%;
  /* Make the image fill the container */
  object-fit: cover;
  /* This will cover the area, no stretching */
  border-radius: 50%;
  /* Ensure the image is also round */
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

.title-date-forum {
  font-size: 12px;
  color: black;
}

.small-text {
  font-size: 12px;
}

/* Styling for thread description */
.description {
  text-align: left;
  /* Center the description */
  margin-top: 10px;
}

/* This will hold both the delete button and the replies count */
.action-container {
  display: flex;
  align-items: flex-start;
  /* Align items to the top */
  position: relative;
}

/* Style for the delete button */
.delete-button {
  position: absolute;
  /* This allows it to be positioned relative to the action-container */
  top: 0;
  /* Align to the top */
  right: 0;
  /* Align to the right */
  background-color: #f4f4f4;
  /* Background color for the button */
  border: none;
  /* Removes any default border */
  padding: 8px 12px;
  /* Some padding for visual appeal */
  cursor: pointer;
  /* A hand cursor to indicate it's clickable */
  transition: background-color 0.3s;
  /* Transition for a smooth color change */
}

/* Change the color on hover for a better UX */
.delete-button:hover {
  background-color: #e0e0e0;
}
</style>
