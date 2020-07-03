const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  major: state => state.user.major,
  school: state => state.user.school,
  certificate_checked: state => state.user.certificate_checked,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  user: state => state.user,
  age: state => state.user.age,
  mobile: state => state.user.mobile,
  certificate: state => state.user.certificate,
  clinic: state => state.clinic
}
export default getters
