<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title_bar">
            <img class="logo" src="../assets/logo_tou.png" />
            <div class="title">chen OJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <a-dropdown @select="handleSelect">
        <a-button>
          <div class="button">
            {{ store.state.user?.loginUser?.userName ?? "你还没登录" }}
          </div>
        </a-button>
        <template #content>
          <a-doption><a href="/user/login"> 登录 </a></a-doption>
          <a-doption><a href="/user/register"> 注册 </a></a-doption>
        </template>
      </a-dropdown>
      <!--      <div href="/user/login">-->
      <!--        {{ store.state.user?.loginUser?.userName ?? "你还没登录" }}-->
      <!--      </div>-->
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { compile, computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/accessEnum";
import component from "*.vue";

// 获取路由组件
const router = useRouter();

// 将初始定义为首页（默认首页）
const selectedKeys = ref(["/"]);
// 路由跳转后，更新选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

// 绑定菜单点击事件，将点击的菜单作为路由跳转的地址
const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};
// 获取全局状态变量
const store = useStore();
console.log(store.state.user.loginUser);

// const loginUser = store.state.user.loginUser;
// 这个本来是定义在外面的，但是因为下面的要变成动态的，所以只能放在里面，因为这个变量是用来获取用户权限的也需要动态获取
// 展示在菜单中的路由数据
// 当对象的meta中的hideInMenu为true时函数返回false，表示不展示
// 需要将visibleRoute通过computed设置成动态的
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    // 如果不符合权限，就不展示
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

// 模拟自动登录
// admin权限
setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    userName: "杨毅不逢111",
    userRole: ACCESS_ENUM.ADMIN,
  });
}, 3000);

// user权限
setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    userName: "杨毅不逢小菜鸡",
    userRole: ACCESS_ENUM.USER,
  });
}, 6000);

// 为了验证调用user中更改用户名的方法，设置三秒后自动将用户名更改为“杨毅不逢”
// dispatch 第一个参数是需要选择调用哪个方法，格式为“文件名/方法”
</script>

<style scoped>
.title_bar {
  display: flex;
  align-items: center;
}

.title {
  color: #42b983;
  margin-left: 16px;
}

.logo {
  height: 48px;
  background: black;
}
</style>
