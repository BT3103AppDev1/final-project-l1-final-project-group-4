<template>
    <div class="container">
        <form @submit.prevent="register" id="registerForm">
            <h2>Register</h2>
            <div class="input">
                Select user type:

                <div class="flex flex-wrap gap-3">
                    <div class="flex align-items-center" style="display: inline-block; margin-right: 10px">
                        <RadioButton 
                            v-model="userType"
                            inputId="userTypeEcoEntrpreneur"
                            name="userTypeSelection"
                            value="Eco-Entrepreneur"
                            required
                        />
                        <label for="userTypeEcoEntrepreneur" class="ml-2">Eco-Entrepreneur</label>
                    </div>
                    
                    <div class="flex align-items-center" style="display: inline-block">
                        <RadioButton
                        v-model="userType"
                        inputId="userTypeGreenRanger"
                        name="userTypeSelection"
                        value="Green Ranger"
                        required
                        />
                        <label for="userTypeGreenRanger" class="ml-2">Green Ranger</label>
                    </div>

                    <div class="flex justify-content-center p-fluid">
                        <div v-focustrap class="card">
                            <div class="field">
                                <InputText
                                id="inputFirstName"
                                v-model="firstName"
                                type="text"
                                placeholder="First Name"
                                autofocus
                                />
                            </div>

                            <div class="field">
                                <InputText
                                id="inputLastName"
                                v-model="lastName"
                                type="text"
                                placeholder="Last Name"
                                autofocus
                                />
                            </div>

                            <div class="field">
                                <div class="p-input-icon-right">
                                    <i class="pi pi-envelope" />
                                    <InputText
                                        id="email"
                                        v-model="email"
                                        type="email"
                                        placeholder="Email"
                                    />
                                </div>
                            </div>

                            <div class="field">
                                <div class="p-float-label">
                                    <Password v-model="password">
                                        <template #header>
                                        <h6>Pick a password</h6>
                                        </template>
                                        <template #footer>
                                        <Divider />
                                        <p class="mt-2">Suggestions</p>
                                        <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                                            <li>At least one lowercase</li>
                                            <li>At least one uppercase</li>
                                            <li>At least one numeric</li>
                                            <li>Minimum 8 characters</li>
                                        </ul>
                                        </template>
                                    </Password>
                                    
                                    <label for="password">Password</label>
                                </div>
                                <br />
                            </div>
                            <Button type="register" label="Register" class="mt-2" />
                        </div>
                    </div>
                </div>
                
            </div>

            <div class="alternative option">
                Already have an account? <span @click="moveToLogin">Login</span>
            </div>

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
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            userType: "",
        };
    },

    methods: {
        register() {
            const auth = getAuth();
            const db = getFirestore();

            createUserWithEmailAndPassword(auth, this.email, this.password)
                .then((userCredential) => {
                if (this.userType == "Eco-Entrepreneur") {
                    setDoc(doc(db, "Eco-Entrepreneur", userCredential.user.uid), {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    });
                } else {
                    setDoc(doc(db, "Green Rangers", userCredential.user.uid), {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    });
                }

                setDoc(doc(db, "Users", userCredential.user.uid), {
                    userType: this.userType,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                });

                const user = userCredential.user;
                //console.log(user);
                console.log("Registration completed.");
                //   this.clearInput();
                this.$router.push("/dashboard");
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
                });
        },

        moveToLogin() {
            this.$router.push("/login")
        },
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