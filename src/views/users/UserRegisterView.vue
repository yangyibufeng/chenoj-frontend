<template>
  <div class="userRegisterView">
    <h2 style="margin-bottom: 30px">用户登录</h2>
    <a-form
      style="max-width: 480px; margin: 0 auto"
      label-align="left"
      auto-label-width
      ref="formRef"
      :rules="rules"
      :model="form"
      :style="{ width: '600px' }"
      @submit="handleSubmit"
    >
      <a-form-item
        field="userAccount"
        label="用户名"
        tooltip="我想弄整齐，只有密码那里有一个问号还占行，我难受"
        validate-trigger="blur"
      >
        <a-input v-model="form.userAccount" placeholder="请输入你的名字 ..." />
      </a-form-item>
      <a-form-item
        field="userPassword"
        tooltip="密码不少于8位，并且只能由数字和大小写字母组成"
        label="密码     "
        validate-trigger="blur"
      >
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码 ..."
        />
      </a-form-item>
      <a-form-item
        field="checkPassword"
        tooltip="密码不少于8位，并且只能由数字和大小写字母组成"
        label="确认密码"
        validate-trigger="blur"
      >
        <a-input-password
          v-model="form.checkPassword"
          placeholder="请确认你的密码 ..."
        />
      </a-form-item>

      <a-form-item style="justify-content: flex-end">
        <a-space>
          <a-button
            type="primary"
            style="width: 120px"
            @click="$refs.formRef.resetFields()"
            >重置
          </a-button>
          <a-button
            type="primary"
            html-type="submit"
            style="width: 120px; margin-left: 15vh"
            >注册
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserRegisterRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
} as UserRegisterRequest);

const handleSubmit = async () => {
  const res = await UserControllerService.userRegisterUsingPost(form);
  if (res.code === 0) {
    alert("注册成功" + JSON.stringify(res.data));
    // 登录成功之后可以保证先让前端页面获取当前用户的信息在进行下面的调转到主页的操作
    await store.dispatch("user/getLoginUser");
    router.push({
      path: "/",
      replace: true,
    });
  } else {
    message.error("注册失败， " + res.message);
  }
};

const rules = {
  userAccount: [
    {
      required: true,
      message: "用户名是必填项",
    },
  ],
  userPassword: [
    {
      required: true,
      message: "密码为必填项",
    },
    {
      validator: (value: any, cb: (arg0: string | undefined) => void) => {
        if (form.userPassword === undefined) {
          // 处理 form.checkPassword 为 undefined 的情况
          cb("密码不能为空");
          return;
        }
        const passwordPattern = /^[0-9a-zA-Z]{6,}$/;
        // alert(form.password + "1");
        if (!passwordPattern.test(form.userPassword)) {
          cb("你密码没有按规定输入哦~~");
        } else {
          cb(undefined);
        }
      },
    },
  ],
  checkPassword: [
    {
      required: true,
      message: "确认密码为必填项",
    },
    {
      validator: (
        value: string | undefined,
        cb: (arg0: string | undefined) => void
      ) => {
        if (form.checkPassword === undefined) {
          // 处理 form.checkPassword 为 undefined 的情况
          cb("密码不能为空");
          return;
        }
        const passwordPattern = /^[0-9a-zA-Z]{6,}$/;

        // alert(form.password + "222");
        if (!passwordPattern.test(form.checkPassword)) {
          cb("你密码没有按规定输入哦~~");
        } else if (value !== form.userPassword) {
          cb("两个密码不匹配！");
        } else {
          cb(undefined);
        }
      },
    },
  ],
};
//
// return {
//   form,
//   rules,
// };
</script>
