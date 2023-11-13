<template>
    <div class="Not-found">
        <h3 id="Title">Page Not Found !! </h3>
        <button class= "return-button" @click="$router.push('/dashboard')">Return to Dashboard</button>
    </div>
</template>

<style scoped>
.Not-found{
    display: grid;
    justify-content: center;
    justify-items: center;
}

.return-button{
    background-color: #748C70;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}
</style>