<script>
import { useDialog } from "primevue/usedialog";
import AddActivityBoxTrial from "./ecofriendlyactivities_components/AddActivityBoxTrial.vue";

export default {
  components: {
    AddActivityBox,
  },
  methods: {
    showAddActivityBox() {
      this.$dialog.open(AddActivityBox, {});
    },
  },
  data() {
    return {
      dialog: useDialog(),
    };
  },
};
</script>

<template>
  <div>
    <Button
      label="Select a Product"
      icon="pi pi-search"
      @click="showAddActivityBox"
    />
    <DynamicDialog />
  </div>
</template>
