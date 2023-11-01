<template>
    <div class="container">
        <form @submit.prevent="register" id="registerForm">
            <h1 class="CreateAccountTitle">Create Account</h1>

            <div class="flex justify-content-center p-fluid">
                <div class="field">
                    <span class="p-float-label">
                        <InputText
                            id="inputFirstName"
                            v-model="firstName"
                            type="text"
                            required
                        />
                        <label for="inputFirstName">First Name</label>
                    </span>
                </div>

                <div class="field">
                    <span class="p-float-label">
                        <InputText
                            id="inputLastName"
                            v-model="lastName"
                            type="text"
                            required
                        />
                        <label for="inputLastName">Last Name</label>
                    </span>
                </div>

                <div class="field">
                    <span class="p-input-icon-right p-float-label">
                        <i class="pi pi-envelope" />
                        <InputText
                            id="email"
                            v-model="email"
                            type="email"
                            required
                        />
                        <label for="email">Email</label>
                    </span>
                </div>

                <div class="field">
                    <div class="p-float-label">
                        <Password v-model="password" id="password" required>
                            <template #header>
                                <h3>Pick a password</h3>
                            </template>

                            <template #footer>
                                <Divider />
                                <p class="mt-2">Suggestions</p>
                                <ul>
                                    <li>At least one lowercase</li>
                                    <li>At least one uppercase</li>
                                    <li>At least one numeric</li>
                                    <li>Minimum 8 characters</li>
                                </ul>
                            </template>
                        </Password>
                        <label for="password">Password</label>
                    </div>
                </div>

                <div class="field userTypeField">
                    <RadioButton 
                        v-model="userType"
                        inputId="userTypeEcoEntrpreneur"
                        name="userTypeSelection"
                        value="Eco-Entrepreneur"

                        class="userTypeInput_style"
                    />
                    <label for="userTypeEcoEntrepreneur" class="radiobutton-label userTypeInput_style">Eco-Entrepreneur</label>

                    <RadioButton
                        v-model="userType"
                        inputId="userTypeGreenRanger"
                        name="userTypeSelection"
                        value="Green Ranger"

                        class="userTypeInput_style"
                    />
                    <label for="userTypeGreenRanger" class="radiobutton-label userTypeInput_style">Green Ranger</label>
                </div>

                <Button type="register" label="Register" class="mt-2 register-button" />
            </div>                

            <div class="alternative_option">
                Already have an account? 
                <span @click="moveToLogin" class="switchTo_login">Login</span>
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
            if (this.userType==""){
                alert("Please select an Account Type you would like to register as!")
                return
            }

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
                } else if (this.userType == "Green Ranger"){
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

                    if (errorCode == "auth/invalid-email") {
                        alert("Invalid Email!\nPlease key in a valid email address!")
                    } else if (errorCode == "auth/missing-password"){
                        alert("Missing Password! \nYou need to key in a valid password to register an account")
                    } else if (errorCode == "auth/weak-password") {
                        alert("Weak Password! \nPlease key in a strong password! \nA valid password should be at least 6 characters.")
                    } else if (errorCode == "auth/email-already-in-use") {
                        alert("Email exists! \nEmail already in use!\n Please use another email or login instead!")
                    } 

                    // let alert_2 = document.querySelector("#alert_2");
                    // alert_2.classList.remove("d-none");
                    // alert_2.innerHTML = errorMessage;
                    // console.log(alert_2);
                });
        },

        moveToLogin() {
            this.$router.push("/login")
        },
    }
}
</script>

<style scoped>
/* import specific font */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap');

.CreateAccountTitle{
    font-size: 32px; 
    font-family: 'Montserrat';
    line-height: 50px; 
    text-align: center;
}

.userTypeField{
    padding-left: 10px;
    height: fit-content;
}

.userTypeInput_style {
    margin-right: 5px;
}

.radiobutton-label{
    margin-right: 15px;
}

/* use :deep to override the primevue css */
:deep(.p-radiobutton-box){
    appearance: none;
    width: 20px;
    height: 20px;
    border: 1px solid #999;
    border-radius: 15%;
}

:deep(.p-radiobutton-icon){
    background: none;
}

:deep(.p-radiobutton-icon::before){
    appearance: none;
    display: flex;
    height: 100%;
    content: "\2713";
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    color: white;
}

.register-button{
    background-color: #5A6D57;
    border: none;
}

.field{
    padding-bottom: 20px;
}

li{
    display: list-item;
    margin-left: 1rem;
    list-style-position: inside;
    list-style: circle;
}

.container{
    width: 50%;
    margin: auto;
}

.alternative_option{
    margin-top: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.switchTo_login{
    margin-left: 20px;
    padding: 5px;
    color: #748C70;
    
}

.switchTo_login:hover{
    background-color: rgba(226, 226, 226, 0.79);
    outline: rgb(201, 201, 201) 0.5px solid;
}
</style>    