<template>
    <button id="signout" @click="signOut"> Logout </button>
</template>

<script>
import {getAuth} from "firebase/auth";

export default {
    name: "Logout",

    methods: {
        signOut() {
            const auth = getAuth();
            auth.signOut()
            .then(() => {
                console.log("Sign Out completed");
                this.$router.push("/");
            })
            .catch((error) => console.log(error));
        },
    }
}
</script>