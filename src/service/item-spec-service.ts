import request, {Result} from "@/common/http.ts";
import {toUrlParams} from "@/common/utils.ts";
import {SVC_PREFIX} from "@/service/contraints.ts";
import {ItemSpec, ItemSpecColor, ItemSpecQueryForm} from "@/models/item-spec-model.ts";


export function querySpecs(params:ItemSpecQueryForm):Promise<Result<ItemSpec[]>>{
  return  request.get(`${SVC_PREFIX}/item-spec?${toUrlParams(params as never)}`)
}

export function getSpec(specId:string):Promise<Result<ItemSpec>>{
    return request.get(`${SVC_PREFIX}/item-spec/${specId}`)
}

export function createSpec(form:ItemSpec):Promise<Result<never>>{
    return request.post(`${SVC_PREFIX}/item-spec`,form)
}

export function updateSpec(form:ItemSpec):Promise<Result<never>>{
    return request.put(`${SVC_PREFIX}/item-spec`,form)
}

export function deleteSpecs(itemIds:string[]):Promise<Result<never>>{
    return request.delete(`${SVC_PREFIX}/item-spec?specIds=${itemIds?.join(",")}`)
}

export function getMediaOfSpec(specId:string):Promise<Result<ItemSpecColor[]>>{
    return  request.get(`${SVC_PREFIX}/item-spec-color?specId=${specId}`)
}

export function createSpecColor(form:ItemSpecColor):Promise<Result<ItemSpecColor[]>>{
    return request.post(`${SVC_PREFIX}/item-spec-color`,form)
}


export function updateSpecColor(form:ItemSpecColor):Promise<Result<ItemSpecColor[]>>{
    return request.put(`${SVC_PREFIX}/item-spec-color`,form)
}

export function deleteSpecColor(colorIds:string[]):Promise<Result<ItemSpecColor[]>>{
    return request.delete(`${SVC_PREFIX}/item-spec-color?colorIds=${colorIds?.join(",")}`)
}

export function deleteSpecMedia(colorIds:string[]):Promise<Result<ItemSpecColor[]>>{
    return request.delete(`${SVC_PREFIX}/item-spec-media?mediaIds=${colorIds?.join(",")}`)
}
