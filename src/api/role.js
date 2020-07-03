import request from '@/utils/request'
import axios from "axios";
import {getToken} from "@/utils/auth";

const prefixUrl = process.env.VUE_APP_BASE_API;

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getDoctors(page, state) {
  let url = prefixUrl + 'professor/doctor?page=' + page
  if (state !== '') {
    url = prefixUrl + 'professor/doctor?page=' + page + '&state=' + state
  }
  return axios.get(url, {
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  })
}

export function getDoctorById(id) {
  return axios.get(prefixUrl + 'professor/doctor/'+id, {
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  })
}

export function addRole(data) {
  return request({
    url: '/vue-element-admin/role',
    method: 'post',
    data
  })
}

export function updateDoctor(id, certificate_checked) {
  return axios.post(prefixUrl + 'professor/doctor/' + id, {
    certificate_checked: certificate_checked
  }, {
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  })
}

export function deleteRole(id) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'delete'
  })
}
