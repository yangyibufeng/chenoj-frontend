import { RouteRecordRaw } from "vue-router";
import HomeView from "@/views/ExampleView.vue";
import IntroduceView from "@/views/SystemIntroduceView.vue";
import NoAuthView from "@/views/NoAuthView.vue";
import ACCESS_ENUM from "@/access/accessEnum";
import UserLoginView from "@/views/users/UserLoginView.vue";
import UserRegisterView from "@/views/users/UserRegisterView.vue";
import UserLayout from "@/layouts/UserLayout.vue";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import QuestionsView from "@/views/question/QuestionsView.vue";
import QuestionSubmitView from "@/views/question/QuestionSubmitView.vue";
import QuestionDetailView from "@/views/question/QuestionDetailView.vue";
import UserInfoView from "@/views/users/UserInfoView.vue";
import UserManageView from "@/views/users/UserManageView.vue";

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
        path: "/user/info",
        name: "用户信息",
        component: UserInfoView,
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
    component: IntroduceView,
  },
  {
    path: "/questions",
    name: "浏览题目",
    component: QuestionsView,
  },
  {
    path: "/questions_submit",
    name: "浏览题目提交",
    component: QuestionSubmitView,
    meta: {
      access: ACCESS_ENUM.USER,
      // hideInMenu: true,
    },
  },
  {
    path: "/view/question/:id",
    name: "题目详情页",
    component: QuestionDetailView,
    props: true,
    meta: {
      access: ACCESS_ENUM.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/add/question",
    name: "创建题目",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    }, // 方便开发，先注释掉
  },
  {
    path: "/update/question",
    name: "更新题目",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
      hideInMenu: true,
    }, // 方便开发，先注释掉
  },
  {
    path: "/manage/question",
    name: "管理题目",
    component: ManageQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    }, // 方便开发，先注释掉
  },
  {
    path: "/manage/user",
    name: "用户管理",
    component: UserManageView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
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
  // {
  //   path: "/about",
  //   name: "浏览题目",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  // },
];
