<template>
  <div class="card">
    <Card>
      <template #content>
        <p class="m-0">Forum Comments</p>
      </template>
      <template #title> {{ noOfComments }} </template>
    </Card>
  </div>
</template>

<script>
export default {
  props: {
    noOfComments: Number,
  },
};
</script>
