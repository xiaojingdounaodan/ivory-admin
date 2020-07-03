/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    icon: 'table',
  },
  children: [
    {
      path: 'complex-table',
      component: () => import('@/views/table/complex-table'),
      name: 'ComplexTable',
      meta: { title: '查询&编辑订单', roles:['admin','professor']}
    },
    {
      path: 'order-table',
      component:()=>import('@/views/order/order-table'),
      name: 'OrderTable',
      meta: {title:'查询订单',roles:['doctor']}
    }
  ]
}
export default tableRouter
