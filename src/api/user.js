import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'
const config = {
  headers: {
    Authorization: 'Bearer ' + getToken()
  }
}
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return axios.post(process.env.VUE_APP_BASE_API + 'auth/me', '', config)
}

export function logout() {
  return axios.post(process.env.VUE_APP_BASE_API + 'auth/logout', '', config)
}
