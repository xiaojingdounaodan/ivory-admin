import request from '@/utils/request'
import axios from 'axios'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return axios.post(process.env.VUE_APP_BASE_API + 'auth/me', '', {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
}

export function logout(token) {
  return axios.post(process.env.VUE_APP_BASE_API + 'auth/logout', '', {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
}
