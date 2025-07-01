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
  },
}
// 拦截 request 请求
uni.addInterceptor('request', httpInterceptor)
// 拦截 uploadFile 文件上传
uni.addInterceptor('uploadFile', httpInterceptor)

/**
 * 封装请求函数
 * @param  UniApp.RequestOptions
 * @returns Promise
 *  1. 返回 Promise 对象
 *  2. 获取数据成功
 *    2.1 提取核心数据 res.data
 *    2.2 添加类型，支持泛型
 *  3. 获取数据失败
 *    3.1 401错误  -> 清理用户信息，跳转到登录页
 *    3.2 其他错误 -> 根据后端错误信息轻提示
 *    3.3 网络错误 -> 提示用户换网络
 */
type Data<T> = {
  code: string
  msg: string
  result: T
}
// 给http添加类型支持泛型
export const http = <T>(options: UniApp.RequestOptions) => {
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      // 响应成功
      success(res) {
        // 如果请求成功，返回数据
        // 提取核心数据res.data
        if (res.statusCode <= 300 && res.statusCode >= 200) {
          // 如果状态码在200-300之间，表示请求成功
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 401) {
          // 如果状态码是401，表示未授权
          // 清理用户信息，跳转到登录页
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({
            url: '/pages/login/login',
          })
          reject(res)
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          uni.showToast({
            icon: 'none',
            title: (res.data as Data<T>).msg || '请求错误',
          })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}
