<template>
  <div class="card">
    <div class="cardTitle">Top Spending Product Category</div>
    <div class="cardContent">{{ highestSpendingProductCategory }}</div>
  </div>
</template>

<script>
export default {
  props: {
    highestSpendingProductCategory: String,
  },
};
</script>

<style scoped>
.card {
  display: flex;
  width: 100%;
  height: 100%;

  padding: 1vh 0rem 1vh 0rem;
  margin: 0rem 0rem 3.5vh 0rem;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  background: var(--neutral-gray-404040, #404040);
}
.cardTitle {
  color: var(--White, #fff);
  text-align: center;

  font-size: 1.5vw;
  font-style: normal;
  font-weight: 400;

  text-transform: capitalize;
}

.cardContent {
  display: flex;
  width: 100%;
  height: 8vh;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: var(--White, #fff);
  text-align: center;
  leading-trim: both;

  text-edge: cap;

  font-size: 3vw;
  font-style: normal;
  font-weight: 700;
  line-height: 40%; /* 39.063% */
  letter-spacing: 0.1vw;
}
</style>
