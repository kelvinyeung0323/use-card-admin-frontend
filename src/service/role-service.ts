import request, {Result} from "@/common/http.ts";
import {Role, RoleQueryForm, RoleUserQueryForm, User} from "@/models/sys-model.ts";
import {toUrlParams} from "@/common/utils.ts";
import {SVC_PREFIX} from "@/service/contraints.ts";


export function queryRole(form: RoleQueryForm): Promise<Result<Role[]>> {
    return request.get(`${SVC_PREFIX}/role?${toUrlParams(form as never)}`)
}

export function getRole(roleId: string): Promise<Result<Role>> {
    return request.get(`${SVC_PREFIX}/role/${roleId}`)
}

export  function createRole(form :Role):Promise<Result<never>>{
    return request.post(`${SVC_PREFIX}/role`,form)
}


export  function updateRole(form :Role):Promise<Result<never>>{
    return request.put(`${SVC_PREFIX}/role`,form)
}

export  function deleteRole(roleIds :string[]):Promise<Result<never>>{
    return request.delete(`${SVC_PREFIX}/role?roleIds=`+roleIds?.join(","))
}
export function switchRoleStatus(roleId:string,checked:boolean):Promise<Result<never>>{
    return request.post(`${SVC_PREFIX}/role-enable`, {roleId:roleId,enabled:checked})
}

export function queryUserOfRole(form: RoleUserQueryForm):Promise<Result<User[]>>{
    return request.get(`${SVC_PREFIX}/role-user?${toUrlParams(form as never)}`)
}

export function createUsersOfRole(roleId:string,userIds:string[]):Promise<Result<never>>{
    return request.post(`${SVC_PREFIX}/role-user`,{roleId,userIds})
}

export function deleteUsersOfRole(roleId:string,userIds:string[]):Promise<Result<never>>{
    return request.delete(`${SVC_PREFIX}/role-user`,{data:{"roleId":roleId,"userIds":userIds}})
}