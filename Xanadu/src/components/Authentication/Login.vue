<template>
  <div class="container">
    <form @submit.prevent="login" id="loginForm">
      <h1 class="LoginTitle">Log In</h1>

      <div class="flex justify-content-center p-fluid">
        <div class="field">
          <span class="p-input-icon-right p-float-label">
            <i class="pi pi-envelope" />
            <InputText id="email" v-model="email" type="email" />
            <label for="email">Email</label>
          </span>
        </div>

        <div class="field">
          <div class="p-float-label">
            <Password v-model="password" :feedback="false" />
            <label for="password">Password</label>
          </div>
        </div>

        <Button type="login" label="Login" class="mt-2 login-button" />
      </div>

      <div class="alternative_option">
        Don't have an account?
        <span @click="moveToRegister" class="switchTo_register">Register</span>
      </div>
    </form>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, collection } from "firebase/firestore";

export default {
  name: "Login",

  data() {
    return {
      email: "",
      password: "",
    };
  },

  methods: {
    async login() {
      const auth = getAuth();
      const db = getFirestore();

      signInWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
          console.log("Login success!");
          this.$router.push("/dashboard");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);

          if (errorCode == "auth/invalid-email") {
            alert("Invalid Email!\nPlease key in a valid email address!");
          } else if (errorCode == "auth/missing-password") {
            alert(
              "Missing Password! \nYou need to key in a valid password to register an account"
            );
          } else if (errorCode == "auth/invalid-login-credentials") {
            alert(
              "Invalid Login credentials! \nYou may have keyed in the wrong email or password. \nPlease try again!"
            );
          }

          // let alert_1 = document.querySelector("#alert_1");
          // alert_1.classList.remove("d-none");
          // alert_1.innerHTML = errorMessage;
          // console.log(alert_1);
        });
    },

    moveToRegister() {
      this.$router.push("/register");
    },
  },
};
</script>

<style scoped>
/* import specific font */
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap");

.LoginTitle {
  font-size: 32px;
  font-family: "Montserrat";
  line-height: 50px;
  text-align: center;
}

.container {
  width: 50%;
  margin: auto;
}

.input {
  margin: 10px;
}

.field {
  padding-bottom: 20px;
}

.login-button {
  background-color: #5a6d57;
  border: none;
}

.alternative_option {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.switchTo_register {
  margin-left: 20px;
  padding: 5px;
  color: #748c70;
}

.switchTo_register:hover {
  background-color: rgba(226, 226, 226, 0.79);
  outline: rgb(201, 201, 201) 0.5px solid;
}
</style>
