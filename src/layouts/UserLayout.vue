<template>
  <div id="userLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <a-space>
          <img src="../assets/logo-zhc%20.png" class="logo" />
          <div>宸 OJ</div>
        </a-space>
      </a-layout-header>

      <a-layout-content class="content">
        <router-view />
      </a-layout-content>

      <a-layout-footer
        class="footer"
        style="height: 40px; line-height: 40px; background-color: transparent"
      >
        <a href="#" target="_blank"> 编程测试 BY 杨毅不逢</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#userLayout {
  text-align: center;
  background: url("https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png")
    0% 0% / 100% 100%;
}

#userLayout .logo {
  width: 64px;
  height: 64px;
}

#userLayout .header {
  //background: red;
  margin-top: 16px;
  margin-bottom: 16px;
  //box-shadow: red 1px 1px 5px;
}

#userLayout .content {
  //background: linear-gradient(to left, #eee, #42b983);
  margin-bottom: 16px;
  padding: 20px;
}

#userLayout .footer {
  //background: #efefef;
  padding: 20px;
  //position: absolute;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script setup lang="ts"></script>
