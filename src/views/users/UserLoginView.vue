<template>
  <div class="userLoginView">
    <h2>用户登录</h2>
    <a-form
      style="max-width: 480px; margin: 0 auto"
      label-align="left"
      auto-label-width
      :model="form"
      @submit="handleSubmit"
    >
      <a-form-item
        field="userAccount"
        tooltip="我想弄整齐，只有密码那里有一个问号还占行，我难受"
        label="账号"
      >
        <a-input v-model="form.userAccount" placeholder="请输入账号..." />
      </a-form-item>
      <a-form-item field="userPassword" tooltip="密码不少于8位" label="密码">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码..."
        />
      </a-form-item>
      <!--      <a-form-item field="isRead">-->
      <!--        <a-checkbox v-model="form.isRead">我已经阅读过守则</a-checkbox>-->
      <!--      </a-form-item>-->
      <a-form-item style="justify-content: flex-end">
        <a-button type="primary" html-type="submit" style="width: 120px"
          >登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

/**
 * 表单信息
 * 先填上，要不然通过localhost访问不会自动填充代码
 * 将类型规范为UserLoginRequest，便于数据传递、校验
 */
const form = reactive({
  userAccount: "xshn",
  userPassword: "123456789",
} as UserLoginRequest);
/**
 * 提交表单
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userLoginUsingPost(form);
  if (res.code === 0) {
    alert("登陆成功" + JSON.stringify(res.data));
    // 登录成功之后可以保证先让前端页面获取当前用户的信息在进行下面的调转到主页的操作
    await store.dispatch("user/getLoginUser");
    router.push({
      path: "/",
      replace: true,
    });
  } else {
    message.error("登陆失败， " + res.message);
  }
};
</script>
