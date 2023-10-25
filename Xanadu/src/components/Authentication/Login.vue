<template>
    <div class="container">
        <form @submit.prevent="login" id="loginForm">
            <h2>Login</h2>

            <div class="flex flex-wrap gap-3">
                <div class="flex justify-content-center p-fluid">
                    <div v-focustrap class="card">
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
                                    <Password v-model="password" :feedback="false"/>
                                    
                                    <label for="password">Password</label>
                                </div>
                        </div>
                        <Button type="login" label="login" class="mt-2" />
                    </div>

                </div>

            </div>

            <div class="alternative option">
                Don't have an account? <span @click="moveToRegister">Register</span>
            </div>
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
        login() {
            const auth = getAuth();

            signInWithEmailAndPassword(auth, this.email, this.password)
                .then(() => {
                    console.log("Login success!")
                    this.$router.push("/dashboard")
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