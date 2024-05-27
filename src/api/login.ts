import request from '@/utils/request'

export function get_captcha(data = {}) {
  return request({
    url: '/pub/tool/get_captcha',
    method: 'get',
    params: data
  })
}

export function login(data = {}) {
  return request({
    url: '/admin/user/login',
    method: 'post',
    data
  })
}
