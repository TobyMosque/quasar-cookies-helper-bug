<template>
  <q-page class="row items-center justify-evenly">
    <q-card>
      <q-card-section> Test Case: {{ testCase }} </q-card-section>
      <q-separator></q-separator>
      <q-card-section>
        <q-input label="Text" v-model="text" />
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section>
        <div><strong>How to Test?</strong></div>
        <div>
          Update the Text and refresh the page and check the console in your
          editor (server) and in the browser (client)
        </div>
        <br />
        <div><strong>Expected result:</strong></div>
        <div>both consoles would appear the same result</div>
        <br />
        <div><strong>How to Toogle between the tests?</strong></div>
        <div>edit the testCase in the src/stores/index.ts</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useTestStore } from 'src/stores/test';
import { testCase } from 'src/stores';
import { storeToRefs } from 'pinia';

const store = useTestStore();
const { text } = storeToRefs(store);
console.log(process.env.SERVER ? 'server: ' : 'client: ', text.value);
</script>
