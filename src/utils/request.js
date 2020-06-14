/**
 * 基于 axios 封装的请求模块
 */
import axios from 'axios'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // 请求的基础路径
})

// 请求拦截器
request.interceptors.request.use(
  // 所有请求都会经过这里
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  // 请求失败会经过这里
  function (error) {
    return Promise.reject(error)
  })

// 响应拦截器

// 导出请求方法
export default request
