import {Res} from "@/models/sys-model.ts";


export function getToken(){
    return localStorage.getItem("k_token")
}

export function setToken(token:string){
    localStorage.setItem("k_token",token)
}

export function clearToken(){
    localStorage.removeItem("k_token")
}
export function isLoggedIn():boolean{
    return localStorage.getItem("k_token") !=null
}

export  function cacheRouterConfig(config :Res[]){

    localStorage.setItem("k_router_config",JSON.stringify(config))
}
export function clearCachedRouterConfig(){
    localStorage.removeItem("k_router_config")
}

export function getCachedRouterConfig():Res[]{
    const str= localStorage.getItem("k_router_config")
    if(str !=null){
        const res:Res[]=JSON.parse(str)
        return res as Res[]
    }else {
        return []
    }

}