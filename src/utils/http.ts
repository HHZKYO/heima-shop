import { useMemberStore } from '@/stores'

// 设置基地址
const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

// 添加拦截器
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 如果不是http开头的，则需拼接地址
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    // 配置超时时间
    options.timeout = 10000
    // 添加小程序端请求头标识
    options.header = {
      ...options.header, // 保留原有的请求头
      'source-client': 'miniapp',
    }
    // 添加token到请求头
    const menberStore = useMemberStore()
    const token = menberStore.profile?.token || ''
    // 如果存在token，则添加到请求头中
    if (token) {
      options.header.Authorization = token
    }
    console.log('请求拦截器', options)
  },
}
// 拦截 request 请求
uni.addInterceptor('request', httpInterceptor)
// 拦截 uploadFile 文件上传
uni.addInterceptor('uploadFile', httpInterceptor)
