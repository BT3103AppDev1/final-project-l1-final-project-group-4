<template>
  <div class="card">
    <Card>
      <template #content>
        <p class="m-0">Forum Threads Started</p>
      </template>
      <template #title> {{ threadsStarted }} </template>
    </Card>
  </div>
</template>

<script>
export default {
  props: {
    threadsStarted: Number,
  },
};
</script>
