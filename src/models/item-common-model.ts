import {IPageable} from "@/models/sys-model.ts";


export type Brand = {
    brandId?: number
    brandLogo?:string
    brandName?: string
    country?: string
    remark?:string
    createdAt?: string
    createdBy?: string
    updatedAt?: string
    updatedBy?: string
    series:Series[]
}

export type BrandQueryForm = IPageable & {
    brandName?: string
    countries?: string[]
    createdAtRange?: [number, number]
}

export type Series = {
    seriesId?: number
    image?:string
    seriesName?: string
    brandId?: string
    brandName?: string
    grade?: string
    remark?:string
    createdAt?: string
    createdBy?: string
    updatedAt?: string
    updatedBy?: string

}
export type SeriesQueryForm = IPageable & {
    seriesName?: string
    brands?: string[]
    grades?: string[]
    createdAtRange?: [number, number]
}
