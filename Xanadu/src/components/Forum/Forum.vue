<template>
  <div>
    <div>
      <Toast ref="toast" position="top-right" />
    </div>
    <div class="container">
      <div class="search-box">
        <input type="text" id="search-bar" v-model="searchTerm" placeholder="Search">
      </div>
      <br>
      <br>
      <div class="add-thread-button">
        <router-link to="/AddThread">Add Thread</router-link>
      </div>
      <Dialog v-model:visible="deleteThreadDialog" :style="{ width: '450px' }" header="Confirm Deletion" :modal="true"
        class="p-fluid">
        <p>Are you sure you want to delete this thread?</p>

        <template #footer>
          <Button label="No" @click="deleteThreadDialog = false" class="p-button-text" />
          <Button label="Yes" @click="confirmDelete" class="p-button-danger" />
        </template>
      </Dialog>

      <!-- Looping through threads -->
      <div v-for="thread in filteredThreads" :key="thread.id" class="forum-thread">
        <div class="user-info">
          <!-- You can add user details here if they are associated with the thread -->
          <div class="profile-pic-username-container">
          <div class="profile-picture">
            <img :src="thread.profilePicture" alt="User's profile picture" class="user-profile-img">
          </div>
          <div class="username">{{ thread.firstName }} {{ thread.lastName }}</div>
        </div>
        </div>
        <div class="thread-details">
          <div class="title-date">
            <div class="thread-title">
              <router-link
                :to="{ name: 'ThreadReply', params: { threadId: thread.id, userId: thread.userId, userType: thread.userType } }">
                <b>{{ thread.title }}</b>
              </router-link>
            </div>
            <!-- Date can be formatted for better appearance -->
            <div class="post-date">Posted on <span class="small-text">{{ thread.timestamp.toDate() }}</span></div>
          </div>
          <!-- Additional details or description can go here -->
          <div class="description">
            {{ thread.content }}
          </div>
        </div>
        <div class="delete-action" v-if="thread.userId === loggedInUserId">
          <Button icon="pi pi-trash" outlined rounded severity="danger"
            @click="confirmDeleteThread(thread.userGroup, thread.userId, thread.id)" style="margin: 5px" />
        </div>

        <div class="replies-container">
          <div class="reply-count">
            <span class="count">{{ thread.repliesCount }} replies</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import { ref } from 'vue';
import Toast from 'primevue/toast';
import {
  getFirestore,
  onSnapshot,
  deleteDoc,
  doc,
  collection,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";

export default {
  components: {
    'Toast': Toast
  },

  data() {
    return {
      db: null,
      toast: ref(null),
      threads: [],
      searchTerm: "",
      deleteThreadDialog: false,
      currentGroupToDelete: null,
      currentUserIdToDelete: null,
      threadIdToDelete: null,
      loggedInUserId: null,
      userGroups: ['Green Rangers', 'Eco-Entrepreneur']
    };
  },

  created() {
    this.db = getFirestore();
    this.searchThreads();
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.loggedInUserId = user.uid;
      } else {
        this.loggedInUserId = null;
      }
    });
  },

  computed: {
    filteredThreads() {
      if (!this.searchTerm) return this.threads;

      return this.threads.filter(thread => {
        return thread.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          thread.content.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    }
  },

  methods: {
    confirmDeleteThread(group, userId, threadId) {
      this.deleteThreadDialog = true;
      this.currentGroupToDelete = group;
      this.currentUserIdToDelete = userId;
      this.threadIdToDelete = threadId;
    },

    async confirmDelete() {
      if (this.threadIdToDelete) {
        try {
          this.$refs.toast.add({
            severity: "error",
            summary: "Deleting Thread...",
            life: 3000,
          });

          // Using the references to delete the specific thread
          await deleteDoc(doc(this.db, this.currentGroupToDelete, this.currentUserIdToDelete, 'threads', this.threadIdToDelete));

          this.$refs.toast.add({
            severity: "success",
            summary: "Thread Deleted!",
            life: 3000,
          });

          this.threadIdToDelete = null;
          this.currentUserIdToDelete = null;
          this.currentGroupToDelete = null;
          this.searchThreads();
        } catch (error) {
          console.error("Error deleting thread: ", error);
          this.$refs.toast.add({
            severity: "error",
            summary: "Error deleting thread!",
            detail: error.message,
            life: 5000,
          });
        }
      }
      this.deleteThreadDialog = false;
    },

    async searchThreads() {
      let allThreads = [];

      for (const group of this.userGroups) {
        const userCollectionRef = collection(this.db, group);
        const usersSnapshot = await getDocs(userCollectionRef);

        for (const userDoc of usersSnapshot.docs) {
          const threadsCollectionRef = collection(this.db, group, userDoc.id, 'threads');
          const threadsSnapshot = await getDocs(threadsCollectionRef);

          for (const threadDoc of threadsSnapshot.docs) {
            const threadData = {
              id: threadDoc.id,
              ...threadDoc.data(),
              userGroup: group,
              userId: userDoc.id,
              firstName: userDoc.data().firstName,
              lastName: userDoc.data().lastName,
              profilePicture: userDoc.data().profilePicture,
              repliesCount: 0 // Initialize with 0
            };
            allThreads.push(threadData);

            const repliesRef = collection(this.db, group, userDoc.id, 'threads', threadDoc.id, 'replies');
            onSnapshot(repliesRef, (replySnapshot) => {
              threadData.repliesCount = replySnapshot.docs.length;
              // To trigger reactivity, you could either:
              // - Use Vue.set if needed (Vue 2 approach, not recommended in Vue 3)
              // - Or, reassign the threads array to itself
              this.threads = [...this.threads];
            });
          }
        }
      }

      // Sort all threads by timestamp after fetching all threads
      allThreads.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

      // Now, update the reactive threads data
      this.threads = allThreads;
    },

  }
}
</script>


<style scoped>
/* global */

* {
  box-sizing: border-box;
}

html {
  font-size: 14px;
  /* font-family: Tahoma, Helvetica, Verdana, Arial, sans-serif; */
  font-family: 'Geneva', Tahoma, Helvetica, Verdana, Arial, sans-serif;
  background-color: white;
  color: black;
}

html,
body {
  margin: 0;
  padding: 0;
}

a {
  color: black;
  font-weight: bolder;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}



h1 {
  font-size: 16px;
  font-weight: bolder;
}

/* home.html */


/* Styling for the forum thread container */
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
  align-items: flex-start; /* Align items to the left side */
  text-align: left; /* Align text to the left */
  margin-right: 30px;
  width: 100px; /* You can adjust the width based on your layout needs */
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
  width: 100%; /* Make the image fill the container */
  height: 100%; /* Make the image fill the container */
  object-fit: cover; /* This will cover the area, no stretching */
  border-radius: 50%; /* Ensure the image is also round */
}

/* Styling for the username */
.username {
    font-weight: bold;
    /* Make sure username text is centered if it wraps to a new line */
    text-align: center;
}

/* Styling for thread details (title and date) */
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

/* This will hold both the delete button and the replies count */
.replies-container {
  position: relative;
  /* Set to relative so we can position the delete button absolutely within it */
  display: flex;
  align-items: center;
  /* Vertically align items in the middle */
  justify-content: flex-end;
  /* Push items to the right */
}

.delete-action {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

/* Style for the delete button */
.delete-button {
  position: absolute !important;
  top: 0px !important;
  right: 20px !important;
  background-color: #f4f4f4 !important;
  border: none !important;
  padding: 8px 12px !important;
  cursor: pointer !important;
  transition: background-color 0.3s !important;
}

/* Change the color on hover for a better UX */
.delete-button:hover {
  background-color: #e0e0e0;
}


/* Styling for reply count (bottom right) */
.reply-count {
  text-align: right;
  /* Right-align reply count */
  align-self: flex-end;
  /* Align to the bottom */
}

/* Styling for the number of replies */
.count {
  font-weight: bold;
}


/*Navbar*/
header {
  height: 10vh;
  background-size: cover;
  background-position: center;

}

ul {
  float: right;
  list-style-type: none;
  margin-top: 32px;
  margin-right: 12px;
  font-size: 16px;

}

ul li {
  display: inline-block;
}

ul li a {
  text-decoration: none;
  color: black;
  padding: 5px 20px;
  border: 1px solid transparent;
  transition: 0.6s ease;
  font-weight: 400;
}

ul li a:hover {
  background-color: #fff;
  color: black;
}

.shipping {
  text-align: center;
  background-color: #738678;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.logo img {
  float: left;
  width: 200px;
  height: auto;
}

/*search box*/
/* Styling for the search box */
.search-box {
  text-align: center;
  /* Center the content horizontally */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  padding: 5px;
}

/* Styling for the search input */
#search-bar {
  width: 400px;
  /* Adjust the width as needed */
  border: none;
  /* Remove the border */
  border-bottom: 1px solid #ccc;
  /* Add a grey underline */
  padding: 5px 0;
  /* Adjust padding for spacing */
  font-size: 16px;
  /* Adjust font size */
  outline: none;
  /* Remove the default outline on focus */
}

/* Style the placeholder text */
#search-bar::placeholder {
  color: #ccc;
  /* Grey color for the placeholder text */
}

/* Optional: Style the input on focus */
#search-bar:focus {
  border-bottom: 2px solid #738678;
  /* Change the underline color on focus */
}



/* Forum info*/
forum-info {
  padding: 20px;
  background-color: black;
}

.chart {
  font-size: 20px;
  font-weight: bold;
}



/*reply*/
.thread_display {
  border: solid;
  border-color: #fffff0;
  background: #fffff0;
  padding: 15px;
}

.thread_display .thread_info {
  opacity: 0.7;
  font-size: small;
  line-height: 0.8px;
}

.thread_display h1 {
  font-size: 25px;
}

.thread_content {
  font-size: 15px;
}

.container .thread_display .comment_btn {
  padding: 0;
  border: none;
  background: none;
  font-size: larger;
  cursor: pointer;
  color: #606060;

}

.head {
  display: flex;
  background-color: #877FA8;
  padding: 5px;
  font-weight: bold;
  font-size: 15px;
}

.authors {
  flex: 20%;
}

.content {
  flex: 80%;
}

.body {
  display: flex;
  background-color: #f59193;
  padding: 10px;
  margin-top: 5px;
}

.body .authors .username {
  font-size: 17px;
}

.body .authors .date {
  font-size: 12px;
}

.body .authors img {
  max-width: 80px;
  max-height: 110px;
}

/*comment*/
.comment-area {
  margin-top: 50px;
}

.comment-area textarea {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  margin-block: 10px;
}

.comment-area input {
  float: right;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
}

.comment-area input:hover {
  border: solid 1px #c83349;
}

/* Add Thread */
.adding {
  margin-top: 50px;
}

.adding .description {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  margin-block: 10px;
}

.adding .title {
  width: 100%;
  padding: 8px;
  margin-block: 10px;
}

/* back btn */
.back_btn {
  margin-top: 65px;
  margin-left: -78px;
  padding: 0;
  border: none;
  background: none;
}

.add-thread-button {
  display: inline-block;
}

/* Styling for the button */
.add-thread-button a {
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
.add-thread-button a:hover {
  background-color: darkgreen;
  /* Change the background color on hover */
}
</style>