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
  watch: {
    activityData(data) {
      // console.log(data);
    },
  },
  methods: {
    activityEdited() {
      this.$emit("activityEdited");
      // console.log("EcoFriendlyActivities have emitted 'activityEdited'!");
    },
    deletedActivity() {
      this.$emit("deletedActivity");
      // console.log("EcoFriendlyActivities have emitted 'deletedActivity'!");
    },
    added() {
      this.$emit("added");
      // console.log("EcoFriendlyActivities have emitted 'added'!");
    },
  },
};
</script>
