import {Res, ResQueryForm} from "@/models/sys-model.ts";
import request, {Result} from "@/common/http.ts";
import {toUrlParams} from "@/common/utils.ts";
import {SVC_PREFIX} from "@/service/contraints.ts";



export  function createRes(form :Res):Promise<Result<never>>{
    return request.post(`${SVC_PREFIX}/res`,form)
}

export  function updateRes(form :Res):Promise<Result<never>>{
    return request.put(`${SVC_PREFIX}/res`,form)
}
export  function getRes(resId :string):Promise<Result<never>>{
    return request.get(`${SVC_PREFIX}/res/${resId}`)
}

export  function deleteRes(resIds :string[]):Promise<Result<never>>{
    return request.delete(`${SVC_PREFIX}/res?resId=${resIds?.join(",")}`)
}

export  function queryRes(form :ResQueryForm):Promise<Result<Res[]>>{
    return request.get(`${SVC_PREFIX}/res?${toUrlParams(form as never)}`)
}