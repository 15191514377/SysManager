import axios from "axios";

//axios全局默认配置
axios.defaults.baseURL = 'http://127.0.0.1:3000';

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    //每次发送请求都携带token
    const token = localStorage.getItem('token')
    config.headers.Authorization = `Bearer ${token}`
    return config
}, function (err) {
    return Promise.reject(err)
})

// 添加响应拦截器
// axios.interceptors.response.use((response)=>{
//     const {authorization} = response.headers
//     authorization&&localStorage.setItem("token",authorization)
//     return response
// },(error)=>{
//     if(error.response.status===401){
//         // localStorage.removeItem("token")
//         location.href = "/login"
//     }
//     return Promise.reject(error)
// })
