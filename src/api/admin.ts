import request from '@/utils/request'

export function adminInfo(data = {}) {
  return request({
    url: '/admin/user/info',
    method: 'get',
    params: data
  })
}
