<template>
  <div id="code-editor" ref="codeEditorRef" style="min-height: 400px" />
  <!--  <a-button @click="fillValue"> 填充新值 </a-button>-->
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import { onMounted, ref, toRaw, withDefaults, defineProps } from "vue";

/**
 * 定义组件属性类型，方便在父组件中获取文本框中的内容
 * 通过父组件给子组件传值来操纵子组件
 */
interface Props {
  value: string;
  handleChange: (v: string) => void;
}

/**
 * 设定一个初始值
 * 这里原本是想设定一个默认空内容，但是因为ES(eslint)语法要求，所以设定成输出v
 */
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  handleChange: (v: string) => {
    console.log(v);
  },
});

const codeEditorRef = ref(); // 用来将获取到的值挂载到元素上面
const codeEditor = ref(); //
// const value = ref("hello word!"); // 定义monaco里面的属性值，表示代码编辑器所显示的内容

const fillValue = () => {
  if (!codeEditor.value) {
    return;
  }
  // 改变codeEditor中的内容
  toRaw(codeEditor.value).setValue("the new code!");
};

onMounted(() => {
  // 在初始化中进行，保证变量是有值的
  if (!codeEditorRef.value) {
    return;
  }

  // monaco.editor可以读取到monaco的实例
  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    value: props.value,
    language: "java",
    automaticLayout: true,
    colorDecorators: true, // 颜色装饰器
    minimap: {
      enabled: true,
      scale: 10, // 小窗口缩放比
    },
    // lineNumbers: "off",
    // roundedSelection: false,
    // scrollBeyondLastLine: false,
    readOnly: false,
    theme: "vs-dark",
  });

  // 编辑 监听内容变化
  codeEditor.value.onDidChangeModelContent(() => {
    // console.log("目前内容为： ", toRaw(codeEditor.value).getValue());
    props.handleChange(toRaw(codeEditor.value).getValue()); // 将获取到的值回传给父组件？
  });
});
</script>

<style></style>
