<template>
    <div class="background-container">
      <h1 class="welcome-text">Welcome To</h1>
      <div class="logo-container">
        <img alt="logo" src="../assets/landing.png">
      </div>
    </div>
  </template>
  
  <style scoped>
  .background-container {
    background-image: url('../assets/background.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 90vh;
    width: 100vw;
  }
  
  .logo-container img {
    max-width: 80%;
    height: auto;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 52%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  
  .welcome-text {
    position: absolute;
    top: 30%; /* Position the "Welcome" text above the logo */
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: #666666; /* Adjust the color as needed */
    font-weight: 660;
  }
  </style>
  
  
