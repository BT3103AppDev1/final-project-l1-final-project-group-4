<template>
  <div class="container">
    <form @submit.prevent="register" id="registerForm">
      <h1 class="CreateAccountTitle">Create Account</h1>

      <div class="flex justify-content-center p-fluid">
        <!-- input: first name -->
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

        <!-- input: last name -->
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

        <!-- input: profile pic -->
        <div class="field">
          <p class="upload-pic-label">Upload profile picture</p>
          <div class="UploadImages">
            <button @click="triggerInput1" id="UploadPictures">
              Upload Picture
            </button>
            <input
              type="file"
              v-show="false"
              ref="uploadPictures1"
              @change="uploadPictures1"
              accept="image/*"
            />
          </div>
        </div>

        <!-- input: username -->
        <div class="field">
          <span class="p-float-label">
            <InputText
              id="inputUsername"
              v-model="username"
              type="text"
              required
            />
            <label for="inputUsername">Username</label>
          </span>
        </div>

        <!-- input: email -->
        <div class="field">
          <span class="p-input-icon-right p-float-label">
            <i class="pi pi-envelope" />
            <InputText id="email" v-model="email" type="email" required />
            <label for="email">Email</label>
          </span>
        </div>

        <!-- input: password -->
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

        <!-- input: select user type -->
        <div class="field userTypeField">
          <RadioButton
            v-model="userType"
            inputId="userTypeEcoEntrpreneur"
            name="userTypeSelection"
            value="Eco-Entrepreneur"
            class="userTypeInput_style"
          />
          <label
            for="userTypeEcoEntrepreneur"
            class="radiobutton-label userTypeInput_style"
            >Eco-Entrepreneur</label
          >

          <RadioButton
            v-model="userType"
            inputId="userTypeGreenRanger"
            name="userTypeSelection"
            value="Green Ranger"
            class="userTypeInput_style"
          />
          <label
            for="userTypeGreenRanger"
            class="radiobutton-label userTypeInput_style"
            >Green Ranger</label
          >
        </div>

        <!-- input: (for sellers) address -->
        <div
          class="field"
          v-if="userType == 'Eco-Entrepreneur'"
          style="margin-top: 10px"
        >
          <span class="p-float-label">
            <InputText
              id="inputAddress"
              v-model="address"
              type="text"
              required
            />
            <label for="inputAddress">Address</label>
          </span>
        </div>

        <!-- input: (for sellers) payment -->
        <div class="field" v-if="userType == 'Eco-Entrepreneur'">
          <p class="upload-pic-label">Upload payment QR code</p>
          <div class="UploadImages">
            <button @click="triggerInput2" id="UploadPictures">
              Upload Picture
            </button>
            <input
              type="file"
              ref="uploadPictures2"
              @change="uploadPictures2"
              accept="image/*"
              required
              v-show="false"
            />
          </div>
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
import firebaseApp from "../../firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
  getStorage,
} from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const storage = getStorage();

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      userType: "",
      img1: null,
      imageData1: false,
      address: "",
      img2: null,
      imageData2: false,
    };
  },

  methods: {
    triggerInput1() {
      this.$refs.uploadPictures1.click();
    },

    uploadPictures1(event) {
      this.uploadValue = 0;
      this.img1 = null;
      this.imageData1 = event.target.files[0];
      this.onUpload1();
    },

    onUpload1() {
      this.img1 = null;
      const childref = ref(storage, `${this.imageData1.name}`);
      const storageRef = uploadBytesResumable(childref, this.imageData1);

      storageRef.on(
        `state_changed`,
        (snapshot) => {
          this.uploadValue =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.log(error.message);
        },
        () => {
          this.uploadValue = 100;
          getDownloadURL(storageRef.snapshot.ref).then((url) => {
            this.img1 = url;
            console.log(this.img1);
            console.log(typeof this.img1);
          });
        }
      );
    },

    triggerInput2() {
      this.$refs.uploadPictures2.click();
    },

    uploadPictures2(event) {
      this.uploadValue = 0;
      this.img2 = null;
      this.imageData2 = event.target.files[0];
      this.onUpload2();
    },

    onUpload2() {
      this.img2 = null;
      const childref = ref(storage, `${this.imageData2.name}`);
      const storageRef = uploadBytesResumable(childref, this.imageData2);

      storageRef.on(
        `state_changed`,
        (snapshot) => {
          this.uploadValue =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.log(error.message);
        },
        () => {
          this.uploadValue = 100;
          getDownloadURL(storageRef.snapshot.ref).then((url) => {
            this.img2 = url;
            console.log(this.img2);
            console.log(typeof this.img2);
          });
        }
      );
    },

    register() {
      if (this.userType == "") {
        alert("Please select an Account Type you would like to register as!");
        return;
      }

      const auth = getAuth();
      const db = getFirestore();

      if (this.img1 == null) {
        this.img1 =
          "https://firebasestorage.googleapis.com/v0/b/xanadu-40991.appspot.com/o/profile.png?alt=media&token=d9062579-1a8f-48dc-902e-85625f45ab4d";
      }

      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          if (this.userType == "Eco-Entrepreneur") {
            setDoc(doc(db, "Eco-Entrepreneur", userCredential.user.uid), {
              firstName: this.firstName,
              lastName: this.lastName,
              username: this.username,
              email: this.email,
              profilePicture: this.img1,
              address: this.address,
              qrcodePicture: this.img2,
            });

            setDoc(doc(db, "Users", userCredential.user.uid), {
              userType: this.userType,
              firstName: this.firstName,
              lastName: this.lastName,
              username: this.username,
              email: this.email,
              profilePicture: this.img1,
              address: this.address,
              qrcodePicture: this.img2,
            });
          } else if (this.userType == "Green Ranger") {
            setDoc(doc(db, "Green Rangers", userCredential.user.uid), {
              firstName: this.firstName,
              lastName: this.lastName,
              username: this.username,
              email: this.email,
              profilePicture: this.img1,
            });

            setDoc(doc(db, "Users", userCredential.user.uid), {
              userType: this.userType,
              firstName: this.firstName,
              lastName: this.lastName,
              username: this.username,
              email: this.email,
              profilePicture: this.img1,
            });
          }

          // setDoc(doc(db, "Users", userCredential.user.uid), {
          //     userType: this.userType,
          //     firstName: this.firstName,
          //     lastName: this.lastName,
          //     username: this.username,
          //     email: this.email,
          //     profilePicture: this.img1,
          // });

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
            alert("Invalid Email!\nPlease key in a valid email address!");
          } else if (errorCode == "auth/missing-password") {
            alert(
              "Missing Password! \nYou need to key in a valid password to register an account"
            );
          } else if (errorCode == "auth/weak-password") {
            alert(
              "Weak Password! \nPlease key in a strong password! \nA valid password should be at least 6 characters."
            );
          } else if (errorCode == "auth/email-already-in-use") {
            alert(
              "Email exists! \nEmail already in use!\n Please use another email or login instead!"
            );
          }

          // let alert_2 = document.querySelector("#alert_2");
          // alert_2.classList.remove("d-none");
          // alert_2.innerHTML = errorMessage;
          // console.log(alert_2);
        });
    },

    moveToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
/* import specific font */
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap");

.CreateAccountTitle {
  font-size: 32px;
  font-family: "Montserrat";
  line-height: 50px;
  text-align: center;
}

.userTypeField {
  padding-left: 10px;
  height: fit-content;
}

.userTypeInput_style {
  margin-right: 5px;
}

.radiobutton-label {
  margin-right: 15px;
}

/* use :deep to override the primevue css */
:deep(.p-radiobutton-box) {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 1px solid #999;
  border-radius: 15%;
}

:deep(.p-radiobutton-icon) {
  background: none;
}

:deep(.p-radiobutton-icon::before) {
  appearance: none;
  display: flex;
  height: 100%;
  content: "\2713";
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  color: white;
}

.register-button {
  background-color: #5a6d57;
  border: none;
}

.field {
  padding-bottom: 20px;
}

li {
  display: list-item;
  margin-left: 1rem;
  list-style-position: inside;
  list-style: circle;
}

.container {
  width: 50%;
  margin: auto;
}

.alternative_option {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.switchTo_login {
  margin-left: 20px;
  padding: 5px;
  color: #748c70;
}

.switchTo_login:hover {
  background-color: rgba(226, 226, 226, 0.79);
  outline: rgb(201, 201, 201) 0.5px solid;
}

.upload-pic-label {
  margin-top: 0;
  padding-left: 10px;
}
</style>
