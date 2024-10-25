import request from '@/utils/request'

export function getInfo(data = {}) {
  return request({
    url: '/admin/user/info',
    method: 'get',
    params: data
  })
}

export function getList(data = {}) {
  return request({
    url: '/admin/user/list',
    method: 'get',
    params: data
  })
}

export function addUser(data = {}) {
  return request({
    url: '/admin/user/add',
    method: 'post',
    data
  })
}

export function changePassword(data = {}) {
  return request({
    url: '/admin/user/change_passwd',
    method: 'post',
    data
  })
}

export function editUser(data = {}) {
  return request({
    url: '/admin/user/edit',
    method: 'post',
    data
  })
}

export function delUser(data = {}) {
  return request({
    url: '/admin/user/del',
    method: 'delete',
    data
  })
}