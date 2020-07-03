import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'
/* Router Modules */
import componentsRouter from './modules/components'
import tableRouter from './modules/table'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '控制台', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人资料', icon: 'user', noCache: true, affix: false }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/usermanager',
    component: Layout,
    redirect: '/usermanager/list',
    alwaysShow: true, // will always show the root menu
    name: 'UserManager',
    meta: {
      title: '用户管理',
      icon: 'lock',
      roles: ['admin', 'professor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/usermanager/list'),
        name: 'UserList',
        meta: {
          title: '用户列表',
          icon: 'user',
          roles: ['admin', 'professor']
        }
      }
    ]
  },
  {
    path: '/data',
    component: Layout,
    name: 'Certificate',
    hidden: true,
    meta: { title: '个人信息' },
    children: [{
      path: '/certificate',
      component: () => import('@/views/certificate/certificate'),
      name: 'Certificate',
      meta: { title: '申请认证', icon: 'edit' }
    }]
  },

  /** when your routing map is too long, you can split it into small modules **/
  componentsRouter,
  tableRouter,

  {
    path: '/patient',
    component: Layout,
    redirect: '/patient/list',
    name: 'Patient',
    meta: {
      title: '患者管理',
      icon: 'el-icon-s-help',
      roles: ['doctor']
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/patient/create'),
        name: 'CreatePatient',
        meta: { title: '创建患者', icon: 'el-icon-plus', roles: ['doctor'] }

      },
      {
        path: ':id/edit',
        component: () => import('@/views/patient/edit'),
        name: 'EditPatient',
        meta: { title: '编辑患者资料', noCache: true, activeMenu: '/patient/list', roles: ['doctor'] },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/patient/list'),
        name: 'PatientList',
        meta: { title: '患者列表', icon: 'el-icon-s-order', roles: ['doctor'] }
      },
      {
        path: ':id',
        component: () => import('@/views/patient/detail'),
        name: 'PatientDetail',
        meta: { title: '患者详情', icon: 'list', activeMenu: '/patient/list', roles: ['doctor', 'admin', 'professor'] },
        hidden: true
      }
    ]
  },
  {
    path: '/patientCase',
    component: Layout,
    redirect: '/patientCase/list',
    name: 'PatientCase',
    meta: {
      title: '病例管理',
      icon: 'el-icon-s-help',
      roles: ['doctor', 'admin', 'professor']
    },
    children: [
      {
        path: 'create/:id',
        component: () => import('@/views/patientCase/create'),
        name: 'CreateArticle',
        meta: { title: '创建病例', icon: 'edit', roles: ['doctor'] },
        hidden: true
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/patientCase/edit'),
        name: 'EditArticle',
        meta: { title: '编辑方案', noCache: true, activeMenu: '/example/list', roles: ['doctor', 'admin', 'professor'] },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/patientCase/list'),
        name: 'ArticleList',
        meta: { title: '病例列表', icon: 'list', roles: ['doctor', 'admin', 'professor'] }
      }
    ]
  },
  {
    path: '/clinic',
    component: Layout,
    name: 'Clinic',
    meta: { title: '我的诊所', roles: ['doctor'] },
    children: [{
      path: '/myClinic',
      component: () => import('@/views/clinic/index'),
      name: 'MyClinic',
      meta: { title: '诊所信息', icon: 'icon' }
    }]
  },
  {
    path: '/theme',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        meta: { title: '主题设置', icon: 'theme' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
