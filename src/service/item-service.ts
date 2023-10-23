import request, {Result} from "@/common/http.ts";
import {toUrlParams} from "@/common/utils.ts";
import {SVC_PREFIX} from "@/service/contraints.ts";
import {ProdItem, ProdItemQueryForm} from "@/models/item-model.ts";


export function queryItems(params:ProdItemQueryForm):Promise<Result<ProdItem[]>>{
  return  request.get(`${SVC_PREFIX}/item?${toUrlParams(params as never)}`)
}

export function getItem(itemId:string):Promise<Result<ProdItem>>{
    return request.get(`${SVC_PREFIX}/item/${itemId}`)
}

export function createItem(form:ProdItem):Promise<Result<never>>{
    return request.post(`${SVC_PREFIX}/item`,form)
}

export function updateItem(form:ProdItem):Promise<Result<never>>{
    return request.put(`${SVC_PREFIX}/item`,form)
}

export function deleteItem(itemIds:string[]):Promise<Result<never>>{
    return request.delete(`${SVC_PREFIX}/item`,{data:{"itemIds":itemIds}})
}