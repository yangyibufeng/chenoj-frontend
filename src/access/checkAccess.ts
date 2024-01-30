import ACCESS_ENUM from "@/access/accessEnum";

/**
 * 检查权限（判断当前用户是否具有某个权限）
 * @param loginUser 当前挡路用户的权限
 * @param needAccess 需要的权限
 * @return boolean 返回true表示可以
 */
const checkAccess = (loginUser: any, needAccess = ACCESS_ENUM.NOT_LOGIN) => {
  // 获取当前登录用户是否具有权限（如果没有 loginUser ，则表示未登录）
  const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN;
  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    return true;
  }
  // 如果需要是用户权限才能访问
  if (needAccess === ACCESS_ENUM.USER) {
    // 如果用户没有登录，那么表示无权限
    if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
      return false;
    }
  }
  // 如果需要管理员权限
  if (needAccess === ACCESS_ENUM.ADMIN) {
    //  没有管理员权限
    if (loginUserAccess !== ACCESS_ENUM.ADMIN) {
      return false;
    }
  }

  return true;
};

export default checkAccess;
