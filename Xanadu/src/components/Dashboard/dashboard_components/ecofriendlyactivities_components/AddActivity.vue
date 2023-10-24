<script>
import { useDialog } from "primevue/usedialog";
import AddActivityBox from "./AddActivityBox.vue";

export default {
  components: {
    AddActivityBox,
  },
  methods: {
    showAddActivityBox() {
      this.$dialog.open(AddActivityBox, {
        emits: {
          onAdded: () => {
            // The 'on' prefix and same emit name are required.
            this.$emit("added"); // {user: 'primetime'}
          },
        },
      });
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
    <Button label="Add Eco-Friendly Activity" @click="showAddActivityBox" />
    <DynamicDialog />
  </div>
</template>
