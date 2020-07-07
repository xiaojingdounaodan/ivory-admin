import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth' // get token from cookie
import store from '@/store'

const prefixUrl = process.env.VUE_APP_BASE_API
const roles = store.getters.roles[0]

const config = {
  headers: {
    Authorization: 'Bearer ' + getToken()
  }
}

// 创建病人
export function createPatient(data) {
  return axios.post(prefixUrl + 'doctor/patient', data, config)
}

// 病人列表
export function fetchList(page) {
  return axios.get(prefixUrl + 'doctor/patient?page=' + page, config)
}

// 指定病人
export function fetchPatient(id) {
  return axios.get(prefixUrl + 'doctor/patient/' + id, config)
}

// 创建病例
export function createCase(patient) {
  return axios.post(prefixUrl + 'doctor/patientCase', patient, config)
}

// 更新病例
export function updateCase(id, data) {
  return axios.post(prefixUrl + 'doctor/patientCase/' + id, data, config)
}

export function updatePatient(id, patient) {
  return axios.post(prefixUrl + 'doctor/patient/' + id, patient, config)
}

// 病例列表
export function fetchCases() {
  switch (roles) {
    case 'doctor':
      return axios.get(prefixUrl + 'doctor/patientCase', config)
    case 'professor':
    case 'admin':
      return axios.get(prefixUrl + 'professor/patientCase', config)
  }
}

// 单个病例
export function fetchCase(id) {
  switch (roles) {
    case 'doctor':
      return axios.get(prefixUrl + 'doctor/patientCase/' + id, config)
    case 'professor':
    case 'admin':
      return axios.get(prefixUrl + 'professor/patientCase/' + id, config)
  }
}

// 订单列表
export function getOrders(page) {
  return axios.get(prefixUrl + roles + '/order?page=' + page, config)
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function getOrdersByDoctor(page) {
  return axios.get(prefixUrl + 'doctor/order?page=' + page, config)
}

export function getOrderByIdFromDoctor(id) {
  return axios.get(prefixUrl + 'doctor/order/' + id, {
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  })
}

export function getDoctorLicense() {
  return axios.get(prefixUrl + 'doctor/certificate', {
    responseType: 'arraybuffer',
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  }).then(response => Buffer.from(response.data, 'binary').toString('base64'))
}

export function getClinicByDoctor() {
  return axios.get(prefixUrl + 'doctor/clinic', config)
}

export function uploadPatientPhoto(id, file) {
  return axios.post(prefixUrl + 'doctor/patient/' + id + '/photo', file, config)
}
