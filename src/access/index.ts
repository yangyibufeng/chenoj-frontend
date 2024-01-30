import ACCESS_ENUM from "@/access/accessEnum";
import router from "@/router";
import store from "@/store";
import checkAccess from "@/access/checkAccess";

router.beforeEach(async (to, from, next) => {
  console.log("登录用户信息", store.state.user.loginUser);
  const loginUser = store.state.user.loginUser;

  // 如果之前没有登录，自动登录
  if (!loginUser || !loginUser.userRole) {
    // 加 await 的目的是为了等用户登录成功之后能执行后续代码
    await store.dispatch("user/getLoginUser");
  }

  // 获取将要跳转的页面所需要的权限，如果没有就设定为最低权限
  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;
  // 如果将要跳转的页面需要权限
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    // 如果当前用户未登录
    if (!loginUser || !loginUser.userRole) {
      // 调转到登陆页面，然后在重定向到要去的页面
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    // 如果检查当前用户的权限不足就跳转到无权限页面
    if (!checkAccess(loginUser, needAccess)) {
      next("/noAuth");
      return;
    }
  }

  next();
});
