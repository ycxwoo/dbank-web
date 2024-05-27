import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { GetToken } from '@/stores/token'
import router from '@/router'

// 处理  类型“AxiosResponse<any, any>”上不存在属性“errorinfo”。ts(2339) 。
declare module 'axios' {
  interface AxiosResponse<T = any> {
    // 这里追加你的参数
    img: ''
    id: ''
    token: ''
    username: ''
    name: ''
    avatar: ''
    introduction: ''
    menu: string[]
    roles: any[]
  }
  export function create(config?: AxiosRequestConfig): AxiosInstance
}

// create an axios instance
// 创建axios 实例
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: import.meta.env.VITE_APP_BASE_URL,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request interceptor 请求拦截器
service.interceptors.request.use(
  (req) => {
    if (!req.headers['token']) {
      req.headers['token'] = GetToken()
    }
    return req
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (Object.prototype.hasOwnProperty.call(res, 'code') && res.code !== 200) {
      // element-ui
      ElMessage({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // token 过期需要刷新
      if (res.code === 401) {
        // to re-login
        ElMessageBox.confirm(
          '你的登录已过期，点击取消停留在当前页，否则跳转到登录界面',
          '登出确认',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          //   store.dispatch('user/resetToken').then(() => {
          //     location.reload()
          //   })
          router.push('/login')
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res.data
    }
  },
  (error) => {
    console.log('err' + error) // for debug
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
