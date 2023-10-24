<template>
    <div class="container">
        <form @submit.prevent="login" id="loginForm">
            <h2>Login</h2>
            <div class="input">
                <label for="email">Email Address: </label>
                <input type="text" id="email">
            </div>

            <div class="input">
                <label for="password">Password: </label>
                <input type="password" id="password">
            </div>

            <div class="alternative option">
                Don't have an account? <span @click="moveToRegister">Register</span>
            </div>

            <button type="submit" id="login_button"> Login </button>
        </form>
    </div>
</template>

<script>
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";

export default {
    name: "Login",

    data(){
        return{
            email: "",
            password: "",
        };
    },

    methods: {
        login(submitEvent) {
            this.email = submitEvent.target.elements.email.value;
            this.password = submitEvent.target.elements.password.value;

            const auth = getAuth();
            signInWithEmailAndPassword(auth, this.email, this.password).then(() => {
                this.clearInput()
                this.$router.push("/home")
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
                let alert_1 = document.querySelector("#alert_1");
                alert_1.classList.remove("d-none");
                alert_1.innerHTML = errorMessage;
                console.log(alert_1);
            });
        },

        moveToRegister() {
            this.$router.push("/register")
        },

        clearInput() {
            document.getElementById("loginForm").reset()
        }
    }
}
</script>

<style scoped>
.container{
    text-align: center;
}

.input{
    margin: 10px;
}
</style>