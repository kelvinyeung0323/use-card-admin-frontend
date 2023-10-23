import {IPageable} from "@/models/sys-model.ts";

export enum SysParamType {
    string,
    text,
    json,
    number,
    boolean
}

export type SysParam = {
    paramId?: string
    paramType?: SysParamType
    paramKey?: string
    paramName?: string
    paramValue?: string
    created_at?: string
    updated_at?: string
    items?:ParamItem[]
}

export type SysParamQueryForm = IPageable & {
    paramName?: string
    paramKey?: string
    paramType?: SysParamType
    createdAtRange?: [number, number]
}


export type ParamItem = {
    itemId?: string
    paramId?: string
    valueType?: SysParamType
    itemName?:string
    itemKey?: string
    itemValue?: string
    description?: string
    parentId?: string
    createdAt?: string
    createdBy?: string
    updatedAt?: string
    updatedBy?: string
    children?: ParamItem[]
}

