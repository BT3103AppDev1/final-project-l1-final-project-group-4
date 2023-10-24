<template>
  <div>
    <div>
      <h1>Add Activity</h1>
    </div>
    <div class="card flex justify-content-center">
      <Dropdown
        v-model="activityType"
        :options="activityTypes"
        optionLabel="label"
        optionValue="value"
        placeholder="Activity Type"
        class="w-full md:w-14rem"
      />
    </div>
    <span class="p-float-label">
      <TextArea id="activityDescription" v-model="activityDescription" />
      <label for="activityDescription">Activity Description</label>
    </span>
    <span class="p-float-label">
      <InputNumber
        v-model="amount"
        inputId="amount"
        :minFractionDigits="0"
        :maxFractionDigits="2"
      />
      <label for="amount">Amount</label>
    </span>
    <div>
      <Calendar v-model="date" showIcon />
    </div>
    <Button label="AddActivity" icon="pi pi-user">Add Activity</Button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activityDescription: null,
      amount: null,
      activityType: null,
      activityTypes: [
        { label: "Water Conservation", value: "Water Conservation" },
        { label: "Energy Conservation", value: "Energy Conservation" },
        { label: "Waste Reduction", value: "Waste Reduction" },
      ],
      date: null,
    };
  },
};
</script>
