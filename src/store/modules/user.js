import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  school: '',
  major: '',
  age: '',
  certificate_checked: '',
  user: null,
  mobile: '',
  certificate: '',
  clinic: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_SCHOOL: (state, school) => {
    state.school = school
  },
  SET_MAJOR: (state, major) => {
    state.major = major
  },
  SET_CERT_STATUS: (state, certificate_checked) => {
    state.certificate_checked = certificate_checked
  },
  SET_AGE: (state, age) => {
    state.age = age
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_PHONE: (state, mobile) => {
    state.mobile = mobile
  },
  SET_CERTIFICATE: (state, certificate) => {
    state.certificate = certificate
  },
  SET_CLINIC: (state, clinic) => {
    state.clinic = clinic
  }
}

const actions = {
  // 登录方法
  login({ commit }, userInfo) {
    const { email, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ email: email.trim(), password: password }).then(response => {
        const data = response.data
        if (data.access_token !== '' && data.access_token !== null) {
          commit('SET_TOKEN', data.access_token)
          setToken(data.access_token)
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('校验失败，请重新登录')
        }

        const user_type = data.type
        const roles = []
        switch (user_type) {
          case 0:
            roles.push('doctor')
            break
          case 2:
            roles.push('professor')
            break
          case 3:
            roles.push('admin')
            break
          default:
            break
        }
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('用户无权限')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', data.username)
        commit('SET_AVATAR', data.head_portrait)
        commit('SET_INTRODUCTION', data.intro)
        commit('SET_SCHOOL', data.school)
        commit('SET_MAJOR', data.major)
        commit('SET_CERT_STATUS', data.certificate_checked)
        commit('SET_AGE', data.age)
        commit('SET_PHONE', data.mobile)
        commit('SET_CERTIFICATE', data.certificate)
        commit('SET_USER', data)
        // 证书状态 0未提交 1正在审核  2已认证
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
