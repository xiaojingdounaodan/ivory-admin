import Vue from 'vue'

Vue.filter('sexFilter', sex => {
  switch (sex) {
    case 0:
      return '男'
    case 1:
      return '女'
    default:
      return '未知'
  }
})

Vue.filter('stateFilter', state => {
  switch (state) {
    case -1:
      return '已取消'
    case 0:
      return '资料已创建'
    case 1:
      return '资料已提交'
    case 2:
      return '资料需修改'
    case 3:
      return '方案已制定'
    case 4:
      return '方案待修改'
    case 5 || 6:
      return '方案已确定'
    case 7:
      return '已下单'
    case 8:
      return '订单已确认'
    case 10:
      return '已存档'
  }
})

Vue.filter('stateColorFilter', state => {
  switch (state) {
    case 0:
    case 1:
      return 'primary'
    case 4:
      return 'warning'
    case 3:
    case 7:
    case 5:
    case 6:
    case 10:
      return 'success'
    case -1:
      return 'info'
    default:
      return 'danger'
  }
})
