<template>
  <div>
    <XanaduTitle />
    <Graphs :key="refreshComp" />
    <AddActivity @added="refresh" />
    <ActivityTable :key="refreshComp" @deletedActivity="refresh" />
  </div>
</template>

<script>
import XanaduTitle from "./components/XanaduTitle.vue";
import AddActivity from "./components/AddActivityBox.vue";
import ActivityTable from "./components/ActivityTable.vue";
import Graphs from "./components/Graphs.vue";

export default {
  name: "Xanadu",
  components: {
    XanaduTitle,
    AddActivity,
    ActivityTable,
    Graphs,
  },

  data() {
    return {
      refreshComp: 0,
    };
  },
  methods: {
    refresh() {
      this.refreshComp += 1;
    },
  },
};
</script>
