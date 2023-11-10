<template>
  <div class="background-container">
    <h1 class="welcome-text">Welcome To</h1>
    <div class="logo-container">
      <img alt="logo" src="../assets/landing.png" class="logo-image">
      <button @click="showAboutDialog = true" class="about-us-button">About Us</button>
    </div>

    <Dialog v-model:visible="showAboutDialog" :style="{ width: '800px' }" header="About Us" :modal="true" class="p-fluid">
      <p>
        Xanadu's main goal is bridging the gap between businesses and consumers, focusing on empowering small sustainable
        businesses. We also act as an online hub for passionate environmental advocates to coordinate discussions and events
        around sustainability.
        <br><br>
        Xanadu's mission: Empowering Sustainability, Connecting Communities.
      </p>
      <template #footer>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

const showAboutDialog = ref(false);
</script>

<style scoped>
.background-container {
  background-image: url('../assets/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 90vh;
  width: 100vw;
  position: relative;
}

.logo-container img {
  max-width: 80%;
  height: auto;
  margin: 0 auto;
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.welcome-text {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  color: #666666;
  font-weight: 660;
}

.about-us-button {
  position: absolute;
  top: calc(50% + 120px); /* Adjust the top value as needed */
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px 20px;
  font-size: 1rem;
  color: white;
  background-color: grey;
  font-weight: 540;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-align: center;
}

.about-us-button:hover {
  background-color: darkslategray;
}
</style>
