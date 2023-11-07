<template>
  <div class="card">
    <Card>
      <template #content>
        <p class="m-0">Top Spending Product Category</p>
      </template>
      <template #title> {{ highestSpendingProductCategory }} </template>
    </Card>
  </div>
</template>

<script>
export default {
  props: {
    highestSpendingProductCategory: String,
  },
};
</script>
