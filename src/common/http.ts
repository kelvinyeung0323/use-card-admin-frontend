import axios from "axios";
import {clearToken, getToken} from "./auth.ts";
import errorCode from "./error-code.ts";
import {message as messager, Modal} from 'antd';

export interface Result<T> {
    code: number,
    msg?: string,
    data: T,
    total?: number,
    pageNum?: number,
    pageSize?: number,
}

const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    withCredentials:false,//使用token 不需cookie,
    headers:{"Content-Type":"application/json",
        "Access-Control-Allow-Origin": "*",
    },
    timeout: 10000
})


service.interceptors.request.use(config => {
    //是否需要设置token
    const isToken = (config.headers || {}).isToken === false
    //是否需要防止数据重复提交
    // const isRepeatSubmit = (config.headers||{}).repeatSumbit === false
    if (getToken() && !isToken) {
        config.headers['Authorization'] = 'Bearer ' + getToken() //让每个请求携带自定义token
    }
    //TODO:重复提交

    return config
}, error => Promise.reject(error))

let isAuthAlertShow = false
service.interceptors.response.use((res) => {
    //未设置状态码则默认成功状态
    const code = res.data.code || res.status;
    //获取错误信息
    const msg = errorCode[code as never] || res.data.msg || errorCode["default"]
    //二进制数据则直接返回
    if (res.request.responseType == "blob" || res.request.response === "arraybuffer") {
        return res.data;
    }

    if (code === 401) {
        if (!isAuthAlertShow) {
            isAuthAlertShow= true;

            Modal.error({
                title: "提示",
                content: "登录状态已过期，你可以继续留 在该页而，或者重新登录",
                okText: "重新登录",
                okCancel:true,
                cancelText: "取消",
                onOk: () => {
                    isAuthAlertShow = false
                    clearToken()
                    location.href = "/#/login";

                },
                onCancel:()=>{
                    isAuthAlertShow = false
                }
            })
        }

        return Promise.reject("无效的会话，或者会话已过期，请重新登录.")
    } else if (code === 500) {
        messager.error(msg)
        return Promise.reject(msg)
    } else if (code !== 200) {
        messager.error(msg)
        return Promise.reject('error')
    } else {
        return Promise.resolve(res.data)
    }

}, error => {
    console.log("err:", error)
    let {message} = error;
    if (message == "Network Error") {
        message == "后端接口连接异常"
    } else if (message.includes("timeout")) {
        message = "系统接口请求超时."
    } else if (message.includes("Request failed with status code")) {
        message = "系统接口" + message.substring(message.length - 3) + "异常";
    }
    messager.error(message)
    return Promise.reject(error)
})


//通用下载方法
// export function download(url:string,params:never,filename:string,config:AxiosRequestConfig){
//     downloadLoadingInstance =null;
//     return service.post(url,params,{
//         transformRequest:[(params)=> toUrlParams(params)],
//         headers:{"Content-Type":"application/x-www-form-urlencoded"},
//         responseType:"blob",
//         ...config
//     }).then(async (data)=>{
//         const isLogin=await blobValidate(data);
//         if(isLogin){
//             const blob = new Blob([data])
//             saveAs(blob,flilename)
//         }else {
//             const resText = await data.text();
//             const respObj = JSON.parse(resText);
//             const errMsg = errorCode[respObj.code]||respObj.msg || errorCode["default"]
//             //TODO: msgbox
//         }
//
//         downloadLoadingInstance.close();
//     }).catch((r)=>{
//         console.log(r)
//         //TODO:
//         downloadLoadingInstance.close();
//     })
// }

export default service

