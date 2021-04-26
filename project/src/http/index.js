import axios from 'axios';
import router from './../router/index.js';
export default function(config) {

    const instance = axios.create({
        baseURL: '/api',
        timeout: 2000,
    });
    // 添加请求拦截器
    instance.interceptors.request.use(function(config) {

        // 在发送请求之前做些什么
        let token = sessionStorage.getItem("token");
        if (token && config.url != '/login') {
            config.headers.Authorization = token;
        }
        if (!token && config.url != '/login') {
            router.replace('/login')
        }
        return config;
    }, function(error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });

    // 添加响应拦截器
    instance.interceptors.response.use(function(response) {
        // 对响应数据做点什么
        if (response.data.status == 400) {
            router.replace('/login')
        }
        return response;
    }, function(error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    });
    return instance(config)



}