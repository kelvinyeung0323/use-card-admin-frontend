import {IPageable} from "@/models/sys-model.ts";

export enum MediaType {
    image,
    video,
    file

}

export type ItemSpec = {
    specId?: string,
    year?: string,
    brandId?: number,
    brandName?:string,
    seriesId?: number,
    seriesName?:string,
    model?: string,
    params?: ItemSpecParam[],
    createdAt?: string,
    updateAt?: string,
}
export type ItemSpecQueryForm = IPageable & {
    year?: string,
    brandIds?: string[],
    seriesIds?: number[],
    model?: string,
}
export enum MediaCatlog{
    exterior,//外观
    interior,//内饰
    space,//空间
}
export type ItemSpecMedia = {
    mediaId?: string
    specId?: string
    sort :number
    thumbnail:string
    mediaType?: MediaType
    catalog?:MediaCatlog
    location: string
    colorId:string
    createdAt :string
}


export enum ItemSpecParamType {
    group,
    text,
    radio,
    number
}

export type ItemSpecParam = {
    label?: string,
    name?:string,
    value?: string;
    type: ItemSpecParamType
    remark?: string
    children?: ItemSpecParam[]
}



export type ItemSpecColor = {
    colorId?   :string
    specId?    :string
    value?     :string
    name?      :string
    medias?    :ItemSpecMedia[]
    createdAt? :string
    createdBy? :string
}


export type ItemSpecColorForm = {
    specId :string
    colors: ItemSpecColor[]
}