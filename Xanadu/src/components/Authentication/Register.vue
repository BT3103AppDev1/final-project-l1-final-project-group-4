<template>
    <div class="container">
        <form @submit.prevent="register" id="registerForm">
            <h2>Register</h2>
            <div class="input">
                Select user type:
                
                <input type="radio" id="user_type1" name="user_type" value="eco_entrepreneur" required>
                <label for="user_type1">Eco Entrepreneur</label>

                <input type="radio" id="user_type2" name="user_type" value="green_ranger" required>
                <label for="user_type2">Green Ranger</label>
            </div>

            <div class="input">
                <label for="first_name">First Name: </label>
                <input type="text" id="first_name" autocomplete="off" required>
            </div>

            <div class="input">
                <label for="last_name">Last Name: </label>
                <input type="text" id="last_name" autocomplete="off" required>
            </div>

            <div class="input">
                <label for="email">Email Address: </label>
                <input type="text" id="email" autocomplete="off" required>
            </div>

            <div class="input">
                <label for="password">Password: </label>
                <input type="password" id="password" autocomplete="off">
            </div>

            <div class="alternative option">
                Already have an account? <span @click="moveToLogin">Login</span>
            </div>

            <button type="submit" id="register_button"> Register </button>
        </form>
    </div>
</template>

<script>
import firebaseApp from "../../firebase.js"
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";

export default {
    data() {
        return {
            email: "",
            password: "",
        };
    },

    methods: {
        register(submitEvent) {
            this.user_type = submitEvent.target.elements.user_type.value;
            this.first_name = submitEvent.target.elements.first_name.value;
            this.last_name = submitEvent.target.elements.last_name.value;
            this.email = submitEvent.target.elements.email.value;
            this.password = submitEvent.target.elements.password.value;
            

            const auth = getAuth();
            const db = getFirestore();

            createUserWithEmailAndPassword(auth, this.email, this.password)
            .then((userCredential) => {
                if (this.user_type == "eco_entrepreneur") {
                    setDoc(doc(db, "Eco-Entrepreneur", userCredential.user.uid), {
                        First_Name: this.first_name,
                        Last_Name: this.last_name,
                        Email: this.email,
                    });
                } else {
                    setDoc(doc(db, "Green Rangers", userCredential.user.uid), {
                        First_Name: this.first_name,
                        Last_Name: this.last_name,
                        Email: this.email,
                    });
                };

                const user = userCredential.user;
                //console.log(user);
                console.log("Registration completed.");
                this.clearInput();
                this.$router.push("/");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
                let alert_2 = document.querySelector("#alert_2");
                alert_2.classList.remove("d-none");
                alert_2.innerHTML = errorMessage;
                console.log(alert_2);
            })
        },

        moveToLogin() {
            this.$router.push("/")
        },

        clearInput() {
            document.getElementById("registerForm").reset()
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