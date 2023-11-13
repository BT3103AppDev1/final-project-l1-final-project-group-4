<template>
  <div>
    <ActivityTable
      :activityData="activityData"
      @added="added"
      @deletedActivity="deletedActivity"
      @activityEdited="activityEdited"
    />
  </div>
</template>

<script>
import ActivityTable from "./ecofriendlyactivities_components/ActivityTable.vue";

export default {
  components: {
    ActivityTable,
  },
  props: {
    activityData: Object,
  },
  methods: {
    activityEdited() {
      this.$emit("activityEdited");
    },
    deletedActivity() {
      this.$emit("deletedActivity");
    },
    added() {
      this.$emit("added");
    },
  },
};
</script>
