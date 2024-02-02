<template>
  <Editor
    :value="value"
    :plugins="plugins"
    :mode="mode"
    @change="handleChange"
    style="min-width: 100vh"
  />
</template>

<script setup lang="ts">
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { Editor, Viewer } from "@bytemd/vue-next";
import { ref, withDefaults, defineProps } from "vue";

/**
 * 定义组件属性类型，方便在父组件中获取文本框中的内容
 * 通过父组件给子组件传值来操纵子组件
 */
interface Props {
  value: string;
  mode?: string;
  handleChange: (v: string) => void;
}

const plugins = [
  gfm(),
  highlight(),
  // Add more plugins here
];
/**
 * 这里原本是想设定一个默认空内容，但是因为ES(eslint)语法要求，所以设定成输出v
 */
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  mode: () => "split",
  handleChange: (v: string) => {
    console.log(v);
  },
});
</script>

<style>
.bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:last-child {
  display: none;
}
</style>
