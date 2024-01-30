<template>
  <div id="app">
    <!--这样可以方便如果有多套布局可以直接在app.vue中切换
    如果当前的路由以/user开头，就用route上面的原始布局
    否则就用自定义的BasicLayout-->
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<style>
#app {
}
</style>

<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import { useRoute } from "vue-router";
import { onMounted } from "vue";

const route = useRoute();

/**
 * 全局初始化函数，有全局单词调用的代码都可以写到这里
 */
const doInit = () => {
  console.log("hello,欢迎来到小菜鸡的项目");
};

onMounted(() => {
  doInit();
});
</script>
