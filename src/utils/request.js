/**
 * 基于 axios 封装的请求模块
 */
import axios from 'axios'
import JSONbig from 'json-bigint'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 请求的基础路径
  transformResponse: [function (data) {
    // Do whatever you want to transform the data

    // 如果后端返回的数据可能 不是 json 格式字符串
    // 如果不是的话 那么 json.parse 调用就会报错
    // 所以我们使用 try-catch 捕获异常 处理异常的发生
    try {
      // 转化成功 把结果返回
      return JSONbig.parse(data)
    } catch {
      // 失败进入这里  把数据原封不动的直接返回给请求使用
      return data
    }
  }]
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
