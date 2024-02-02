import { RouteRecordRaw } from "vue-router";
import HomeView from "@/views/ExampleView.vue";
import AdminView from "@/views/AdminView.vue";
import NoAuthView from "@/views/NoAuthView.vue";
import ACCESS_ENUM from "@/access/accessEnum";
import UserLoginView from "@/views/users/UserLoginView.vue";
import UserRegisterView from "@/views/users/UserRegisterView.vue";
import UserLayout from "@/layouts/UserLayout.vue";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    children: [
      {
        path: "/user/login",
        name: "用户登录",
        component: UserLoginView,
      },
      {
        path: "/user/register",
        name: "用户注册",
        component: UserRegisterView,
      },
    ],
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/",
    name: "宸OJ",
    component: HomeView,
  },
  {
    path: "/add/question",
    name: "创建题目",
    component: AddQuestionView,
    // meta: {
    //   access: ACCESS_ENUM.ADMIN,
    // }, // 方便开发，先注释掉
  },
  {
    path: "/update/question",
    name: "更新题目",
    component: AddQuestionView,
    // meta: {
    //   access: ACCESS_ENUM.ADMIN,
    // }, // 方便开发，先注释掉
  },
  {
    path: "/manage/question",
    name: "管理题目",
    component: ManageQuestionView,
    // meta: {
    //   access: ACCESS_ENUM.ADMIN,
    // }, // 方便开发，先注释掉
  },
  {
    path: "/hide",
    name: "隐藏文件",
    component: HomeView,
    meta: {
      hideInMenu: true,
    },
  },
  // {
  //   path: "/admin",
  //   name: "管理题目",
  //   component: AdminView,
  //   meta: {
  //     // hideInMenu: true,
  //     access: ACCESS_ENUM.ADMIN,
  //   }, //vue-router 提供的可以覆盖原信息的功能
  // },
  {
    path: "/noAuth",
    name: "无权页面",
    component: NoAuthView,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/about",
    name: "浏览题目",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];
