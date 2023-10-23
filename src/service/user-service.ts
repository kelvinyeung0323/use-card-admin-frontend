import { User, UserQueryForm} from "@/models/sys-model.ts";

import request, {Result} from "@/common/http.ts";
import {toUrlParams} from "@/common/utils.ts";
import {SVC_PREFIX} from "@/service/contraints.ts";



export  function createUser(form :User):Promise<Result<never>>{
    return request.post(`${SVC_PREFIX}/user`,form)
}

export  function updateUser(form :User):Promise<Result<never>>{
    return request.put(`${SVC_PREFIX}/user`,form)
}

export function queryUser(form:UserQueryForm):Promise<Result<User[]>>{
    return request.get(`${SVC_PREFIX}/user?${toUrlParams(form as never)}`)
}

export function getUser(userId:string):Promise<Result<User>>{
    return request.get(`${SVC_PREFIX}/user/${userId}`)
}

export function deleteUsers(userIds:string[]):Promise<Result<never>>{
    return request.delete(`${SVC_PREFIX}/user?userIds=`+userIds?.join(","))
}
export function switchUserStatus(userId:string,checked:boolean):Promise<Result<never>>{
    return request.post(`${SVC_PREFIX}/user/enable`, {userId:userId,enabled:checked})
}

export function changePassword(userId:string,password:string):Promise<Result<never>>{
    return request.post(`${SVC_PREFIX}/user/password`, {userId:userId,password:password})
}
