import request from '@/utils/request'

export function getList(data = {}) {
  return request({
    url: '/admin/role/list',
    method: 'get',
    params: data
  })
}

