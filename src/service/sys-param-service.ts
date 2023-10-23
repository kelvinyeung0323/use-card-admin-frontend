import request, {Result} from "@/common/http.ts";
import { SVC_PREFIX} from "@/service/contraints.ts";
import {ParamItem, SysParam, SysParamQueryForm} from "@/models/sys-param-model.ts";
import {toUrlParams} from "@/common/utils.ts";




export  function createParam(form :SysParam):Promise<Result<never>>{
    return request.post(`${SVC_PREFIX}/sys-param`,form)
}

export  function updateParam(form :SysParam):Promise<Result<never>>{
    return request.put(`${SVC_PREFIX}/sys-param`,form)
}

export  function getParam(paramId:string):Promise<Result<SysParam>>{
    return request.get(`${SVC_PREFIX}/sys-param/${paramId}`)
}
export  function getAllParamsWithItems():Promise<Result<SysParam[]>>{
    return request.get(`${SVC_PREFIX}/sys-param-all`)
}
export  function getParamWithItemsByKey(paramKey:string):Promise<Result<SysParam>>{
    return request.get(`${SVC_PREFIX}/sys-param-with-item/${paramKey}`)
}

export  function deleteParams(paramIds:string[]):Promise<Result<never>>{
    return request.delete(`${SVC_PREFIX}/sys-param?paramIds=${paramIds.join(",")}`,)
}

export function queryParams(form:SysParamQueryForm):Promise<Result<SysParam[]>>{
    return request.get(`${SVC_PREFIX}/sys-param?${toUrlParams(form as never)}`)
}


// 条目 =========================

export  function createItem(form :ParamItem):Promise<Result<never>>{
    return request.post(`${SVC_PREFIX}/sys-param-item`,form)
}

export  function updateItem(form :ParamItem):Promise<Result<never>>{
    return request.put(`${SVC_PREFIX}/sys-param-item`,form)
}

export  function getItem(itemId:string):Promise<Result<ParamItem>>{
    return request.get(`${SVC_PREFIX}/sys-param-item/${itemId}`)
}

export  function deleteItems(itemIds:string[]):Promise<Result<never>>{
    return request.delete(`${SVC_PREFIX}/sys-param-item?itemIds=${itemIds.join(",")}`,)
}

export function getItemsOfParam(paramId :string):Promise<Result<ParamItem[]>>{
    return request.get(`${SVC_PREFIX}/sys-param-item?paramId=${paramId}`)
}
