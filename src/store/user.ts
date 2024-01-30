// initial state
import { StoreOptions } from "vuex";
import ACCESS_ENUM from "@/access/accessEnum";
import { UserControllerService } from "../../generated";

const state = () => ({}); // 需要进行存储的状态信息

// getters
const getters = {}; // 便捷获取对象的方法

// actions（支持异步）
// 执行异步操作，触发mutation的更改（actions调用mutation）
const actions = {};

// mutations（尽量同步）
// 修改状态变量(定义了对变量进行增删改的方法），类似于CRUD
// payload表示一个从外面传递进来的参数
const mutations = {};

export default {
  namespaced: true,
  state: () => ({
    loginUser: {
      // userName: "杨毅不逢",
      userName: "未登录",
      // userRole: ACCESS_ENUM.NOT_LOGIN,
      // 将该处的用户角色注释掉，是为了区分一开始未登录和从远程获取用户数据失败的情况
    },
  }),
  actions: {
    async getLoginUser({ commit, state }, payload) {
      // 要改成远程登录（从远程获取登录信息）
      // commit("updateUser", {
      //   userName: "杨毅不逢",
      //   userRole: ACCESS_ENUM.ADMIN,
      // });
      // 要改成从传入的参数来修改状态
      // commit("updateUser", payload);
      // 从远程获取登录信息
      const res = await UserControllerService.getLoginUserUsingGet();
      if (res.code === 0) {
        commit("updateUser", res.data);
      } else {
        commit("updateUser", {
          ...state.loginUser,
          userRole: ACCESS_ENUM.NOT_LOGIN,
        });
      }
    },
  },
  mutations: {
    updateUser(state, payload) {
      state.loginUser = payload;
    },
  },
} as StoreOptions<any>;
