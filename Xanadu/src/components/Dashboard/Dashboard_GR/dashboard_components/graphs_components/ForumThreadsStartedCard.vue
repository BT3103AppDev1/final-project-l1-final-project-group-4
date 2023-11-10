<template>
  <div class="card">
    <div class="cardTitle">Forum Threads Started</div>
    <div class="cardContent">{{ threadsStarted }}</div>
  </div>
</template>

<script>
export default {
  props: {
    threadsStarted: Number,
  },
};
</script>

<style scoped>
.card {
  display: flex;
  width: 100%;
  height: 100%;
  /* padding: 0px 23px 15px 23px; */
  padding: 0rem 0rem 0.5rem 0rem;
  margin: 0rem 0rem 2rem 0rem;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  background: var(--neutral-gray-404040, #404040);
}
.cardTitle {
  color: var(--White, #fff);
  text-align: center;
  /* buttonLG */
  /* font-family: Montserrat; */
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 180%; /* 28.8px */
  text-transform: capitalize;
}

.cardContent {
  display: flex;
  width: 25rem;
  height: 4rem;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: var(--White, #fff);
  text-align: center;
  leading-trim: both;

  text-edge: cap;
  /* font-family: Montserrat; */
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 40%; /* 39.063% */
  letter-spacing: 0.2rem;
}
</style>
