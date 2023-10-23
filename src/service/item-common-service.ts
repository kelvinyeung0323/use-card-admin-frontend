import request, {Result} from "@/common/http.ts";
import {SVC_PREFIX} from "@/service/contraints.ts";
import {toUrlParams} from "@/common/utils.ts";
import {Brand, BrandQueryForm, Series, SeriesQueryForm} from "@/models/item-common-model.ts";


export function queryBrands(params:BrandQueryForm):Promise<Result<Brand[]>>{
    return  request.get(`${SVC_PREFIX}/brand?${toUrlParams(params as never)}`)
}
export function getAllBrandsWithSeries():Promise<Result<Brand[]>>{
    return  request.get(`${SVC_PREFIX}/brand-all?`)
}
export function getBrand(brandId:number):Promise<Result<Brand>>{
    return request.get(`${SVC_PREFIX}/brand/${brandId}`)
}

export function createBrand(form:Brand):Promise<Result<never>>{
    return request.post(`${SVC_PREFIX}/brand`,form)
}

export function updateBrand(form:Brand):Promise<Result<never>>{
    return request.put(`${SVC_PREFIX}/brand`,form)
}

export function deleteBrands(brandIds:number[]):Promise<Result<never>>{
    return request.delete(`${SVC_PREFIX}/brand?brandIds=${brandIds.join(",")}`)
}

export function querySeries(params:SeriesQueryForm):Promise<Result<Series[]>>{
    return  request.get(`${SVC_PREFIX}/series?${toUrlParams(params as never)}`)
}

export function getSeries(seriesId:number):Promise<Result<Series>>{
    return request.get(`${SVC_PREFIX}/series/${seriesId}`)
}

export function createSeries(form:Series):Promise<Result<never>>{
    return request.post(`${SVC_PREFIX}/series`,form)
}

export function updateSeries(form:Series):Promise<Result<never>>{
    return request.put(`${SVC_PREFIX}/series`,form)
}

export function deleteSeries(seriesIds:number[]):Promise<Result<never>>{
    return request.delete(`${SVC_PREFIX}/series?seriesIds=${seriesIds.join(",")}`)
}