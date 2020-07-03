import axios from 'axios'
import { getToken } from '@/utils/auth' // get token from cookie
const prefixUrl = process.env.VUE_APP_BASE_API

export function getOrderByIdFromProfessor(id) {
  return axios.get(prefixUrl + 'professor/order/' + id, {
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  })
}

export function updateOrderByIdFromProfessor(id, orderData) {
  return axios.post(prefixUrl + 'professor/order/' + id, orderData, {
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  })
}

// 病人列表
export function fetchListFromProfessor(page) {
  return axios.get(prefixUrl + 'professor/patient?page=' + page, {
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  })
}

// 指定病人
export function fetchPatientFromProfessor(id) {
  return axios.get(prefixUrl + 'professor/patient/' + id, {
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  })
}

// 病例列表
export function fetchCasesFromProfessor() {
  return axios.get(prefixUrl + 'professor/patientCase', {
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  })
}

// 单个病例
export function fetchCaseFromProfessor(id) {
  return axios.get(prefixUrl + 'professor/patientCase/' + id, {
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  })
}
