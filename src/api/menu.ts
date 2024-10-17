import request from '@/utils/request'

export function getList(data = {}) {
  return request({
    url: '/admin/menu/list',
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

