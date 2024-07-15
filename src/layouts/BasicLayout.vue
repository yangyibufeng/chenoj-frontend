<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>

      <a-layout-content class="content">
        <router-view />
      </a-layout-content>

      <a-layout-footer
        class="footer"
        style="
          position: sticky;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 40px;
          line-height: 40px;
          background-color: transparent;
        "
      >
        <a href="#" target="_blank"> 编程测试 BY 杨毅不逢</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#basicLayout {
  margin: 0 20px;
}

#basicLayout .header {
  box-shadow: #eee 1px 1px 5px;
  height: 60px;
  margin: 5px;
}

#basicLayout .content {
  //background: linear-gradient(to left, #eee, #dcc89c);
  background: linear-gradient(to left, #ffffff, #ffffff);
  margin-bottom: 16px;
  padding: 20px;
}

#basicLayout .footer {
  background: #efefef;
  padding: 20px;
  //position: absolute;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script setup lang="ts">
import GlobalHeader from "@/components/GlobalHeader.vue";
</script>
