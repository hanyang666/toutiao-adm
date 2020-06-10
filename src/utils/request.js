// 基于 axios 封装请求模块
import axios from 'axios'

// 创建一个axios实例
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'// 请求基础路径
})

// 请求拦截器

// 响应拦截器

// 导出请求方法
export default request
