import request from '@/utils/request'

export function getList(data = {}) {
  return request({
    url: '/admin/role/list',
    method: 'get',
    params: data
  })
}

export function getInfo(data = {}) {
  return request({
    url: '/admin/role/info',
    method: 'get',
    params: data
  })
}

export function addRole(data = {}) {
  return request({
    url: '/admin/role/add',
    method: 'post',
    data
  })
}

export function editRole(data = {}) {
  return request({
    url: '/admin/role/edit',
    method: 'post',
    data
  })
}

export function delRole(data = {}) {
  return request({
    url: '/admin/role/del',
    method: 'delete',
    data
  })
}
