import request from '@/utils/request'

export function getList(data = {}) {
  return request({
    url: '/admin/menu/list',
    method: 'get',
    params: data
  })
}

export function getInfo(data = {}) {
  return request({
    url: '/admin/menu/info',
    method: 'get',
    params: data
  })
}

export function addMenu(data = {}) {
  return request({
    url: '/admin/menu/add',
    method: 'post',
    data
  })
}

export function editMenu(data = {}) {
  return request({
    url: '/admin/menu/edit',
    method: 'post',
    data
  })
}

export function delMenu(data = {}) {
  return request({
    url: '/admin/menu/del',
    method: 'delete',
    data
  })
}