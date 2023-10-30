<!-- <template>
  <div>
    <b-progress :value="value" :max="max" show-progress animated></b-progress>
    <b-progress class="mt-2" :max="max" show-value>
      <b-progress-bar
        :value="value * (6 / 10)"
        variant="success"
      ></b-progress-bar>
      <b-progress-bar
        :value="value * (2.5 / 10)"
        variant="warning"
      ></b-progress-bar>
      <b-progress-bar
        :value="value * (1.5 / 10)"
        variant="danger"
      ></b-progress-bar>
    </b-progress>

    <b-button class="mt-3" @click="randomValue">Click me</b-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: 45,
      max: 100,
    };
  },
  compatConfig: { MODE: 3 },
  methods: {
    randomValue() {
      this.value = Math.random() * this.max;
    },
  },
};
</script> -->

<template>
  <div class="container">
    <b-jumbotron
      header="Bootstrap-Vue"
      lead="Bootstrap v4 Components for Vue.js 2"
    >
      <p>Now running on @vue/compat and Vue.js 3</p>
      <b-button variant="primary" @click="showModal"> Click me! </b-button>
    </b-jumbotron>
  </div>
</template>
<script>
import { BIcon, BIconCamera } from "bootstrap-vue";
export default {
  methods: {
    showModal() {
      this.$bvModal.msgBoxOk("Modal from @vue/compat");
    },
  },
};
</script>
