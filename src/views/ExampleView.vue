<template>
  <div class="exampleView">
    <MdEditor :value="mdValue" :handle-change="onMdChange" />
    {{ mdValue }}
    <CodeEditor :value="codeValue" :handle-change="onCodeChange" />
    {{ codeValue }}
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import CodeEditor from "@/components/CodeEditor.vue"; // @ is an alias to /src

const mdValue = ref();
const codeValue = ref();

const onMdChange = (v: string) => {
  mdValue.value = v;
};

const onCodeChange = (v: string) => {
  codeValue.value = v;
};
</script>
