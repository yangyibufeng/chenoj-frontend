<template>
  <div id="userInfoView">
    <a-descriptions-item>
      <a-avatar :size="100" shape="circle">
        <img alt="头像" :src="loginUser.userAvatar" />
      </a-avatar>
    </a-descriptions-item>
    <a-card title="我的信息">
      <a-descriptions :data="data" size="large" column="1" bordered />
      <template #extra>
        <a-badge status="success" text="在线" />
      </template>
    </a-card>
    <a-modal
      width="30%"
      :visible="visible"
      placement="right"
      @ok="handleOk"
      @cancel="closeModel"
      unmountOnClose
    >
      <div style="text-align: center">
        <a-upload
          action="/"
          :fileList="file ? [file] : []"
          :show-file-list="false"
          @change="onChange"
        >
          <!--        >:custom-request="uploadAvatar"-->
          <template #upload-button>
            <div
              class="arco-upload-list-picture custom-upload-avatar"
              v-if="updateForm.userAvatar"
            >
              <a-avatar :size="70" shape="circle">
                <img alt="头像" :src="userAvatarImg" />
              </a-avatar>
              <div class="arco-upload-list-picture-mask">
                <IconEdit />
              </div>
            </div>
          </template>
        </a-upload>
      </div>
      <a-form
        :model="loginUser"
        label-align="right"
        title="个人信息"
        style="max-width: 480px; margin: 0 auto"
        :rules="rules"
      >
        <a-form-item field="用户名称" label="账号 :">
          <a-input v-model="updateForm.userName" placeholder="请输入用户名称" />
        </a-form-item>
        <a-form-item field="userEmail" label="邮箱 :" validate-trigger="blur">
          <a-input v-model="updateForm.userEmail" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item field="userPhone" label="电话 :" validate-trigger="blur">
          <a-input
            v-model="updateForm.userPhone"
            placeholder="请输入电话号码"
          />
        </a-form-item>
        <a-form-item field="userProfile" label="简介 :">
          <a-textarea
            v-model="updateForm.userProfile"
            placeholder="请输入简介"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <div>
      <a-button
        shape="round"
        status="success"
        size="small"
        type="outline"
        style="margin: 10px"
      >
        <a-link @click="toIndex">首页</a-link>
      </a-button>
      <a-button
        shape="round"
        status="normal"
        size="medium"
        type="outline"
        style="margin: 10px"
        @click="openModalForm"
        >修改用户信息
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import {
  FileControllerService,
  UserControllerService,
  UserUpdateMyRequest,
} from "../../../generated";
import { ref } from "vue";
import { FileItem, Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import moment from "moment";

const router = useRouter();
const file = ref();
/**
 * 获取用户信息
 */
const store = useStore();
let loginUser = store.state.user.loginUser;

const data = [
  {
    label: "用户昵称：",
    value: loginUser.userName,
  },
  {
    label: "用户账号：",
    value: loginUser.userAccount,
  },
  {
    label: "我的简介：",
    value: loginUser.userProfile,
  },
  {
    label: "用户角色：",
    value: loginUser.userRole === "user" ? "普通用户" : "管理员",
  },
  {
    label: "邮箱：",
    value: loginUser.userEmail || "未填写",
  },
  {
    label: "电话：",
    value: loginUser.userPhone || "未填写",
  },
  // {
  //   label: "当前状态：",
  //   value: loginUser.userState !== "" ? loginUser.userState : "暂无简介",
  // },

  {
    label: "创建时间：",
    value: moment(loginUser.createTime).format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    label: "修改时间：",
    value: moment(loginUser.updateTime).format("YYYY-MM-DD HH:mm:ss"),
  },
];

const rules = {
  // 添加邮箱验证规则
  userEmail: [
    {
      required: true,
      message: "邮箱是必填项",
      trigger: ["blur", "change"],
    },
    {
      validator: (value: any, cb: (arg0: string | undefined) => void) => {
        if (updateForm.value.userEmail === undefined) {
          // 处理 form.checkPassword 为 undefined 的情况
          cb("邮箱不能为空");
          return;
        }
        const emailPattern =
          /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        // alert(form.password + "1");
        if (!emailPattern.test(updateForm.value.userEmail)) {
          cb("邮箱格式错误，请重新输入");
        } else {
          cb(undefined);
        }
      },
    },
  ],
  // 添加电话验证规则（此处以中国大陆手机号为例）
  userPhone: [
    {
      required: true,
      message: "电话号码是必填项",
      trigger: ["blur", "change"],
    },
    {
      validator: (value: any, cb: (arg0: string | undefined) => void) => {
        if (updateForm.value.userPhone === undefined) {
          // 处理 form.checkPassword 为 undefined 的情况
          cb("邮箱不能为空");
          return;
        }
        const phonePattern = /^1[3-9]\d{9}$/;
        // alert(form.password + "1");
        if (!phonePattern.test(updateForm.value.userPhone)) {
          cb("请输入有效的中国大陆手机号码");
        } else {
          cb(undefined);
        }
      },
    },
  ],
};

const visible = ref(false);
const updateForm = ref<UserUpdateMyRequest>({
  ...store.state.user?.loginUser,
});

// 从表单中获取的用户头像
let userAvatarImg = updateForm.value.userAvatar;

/**
 * 上传头像
 */
/*const uploadAvatar = async () => {
  const res = await FileControllerService.uploadOssFileUsingPost(
    file?.value.file
  );
  if (res.code === 0) {
    userAvatarImg = res.data;
    Message.success("上传成功，点击确认即可修改头像");
  } else {
    Message.error("上传失败！" + res.data);
  }
};*/
/**
 * 打开弹窗
 */
const openModalForm = () => {
  visible.value = true;
};
/**
 * 确定修改按钮
 */
const handleOk = async () => {
  const res = await UserControllerService.updateMyUserUsingPost({
    ...updateForm.value,
    userAvatar: userAvatarImg,
  });
  if (res.code === 0) {
    Message.success("更新成功！");
    visible.value = false;
    location.reload();
  } else {
    Message.error("更新失败！", res.msg);
  }
};
const closeModel = () => {
  visible.value = false;
};
/**
 * 回到首页
 * @param question
 */
const toIndex = () => {
  router.push({
    path: `/`,
  });
};
const onChange = async (_: never, currentFile: FileItem) => {
  file.value = {
    ...currentFile,
  };
};
</script>

<style scoped>
#userInfoView {
  margin: 0 auto;
  padding: 10px;
  max-width: 820px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(35, 7, 7, 0.21);
}
</style>
