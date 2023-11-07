<template>
  <div>
    <a-tooltip title="3 done / 3 in progress / 4 to do">
      <a-progress
        :percent="totalPercent"
        :success="success"
        :show-info="false"
      />
    </a-tooltip>
  </div>
</template>

<script>
export default {
  data() {
    return {
      success: { percent: 50 },
      totalPercent: 80,
      show: true,
    };
  },
  props: {
    threadsStarted: Number,
    noOfComments: Number,
  },
};
</script>
