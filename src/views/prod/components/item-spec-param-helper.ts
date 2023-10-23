import {ItemSpecParam, ItemSpecParamType} from "@/models/item-spec-model.ts";
import {ParamItem, SysParamType} from "@/models/sys-param-model.ts";


function toMap(params: ItemSpecParam[]): Map<string, ItemSpecParam> {
    const map = new Map<string, ItemSpecParam>()
    for (const param of params) {
        map.set(param.name as string, param)
    }
    return map
}

function toItemSpecParamType(type?:SysParamType){
    switch (type){
        case SysParamType.boolean:
            return ItemSpecParamType.text
        case SysParamType.json:
            return ItemSpecParamType.text
        case SysParamType.text:
            return ItemSpecParamType.text
        case SysParamType.string:
            return ItemSpecParamType.text
        case SysParamType.number:
            return ItemSpecParamType.number
        default:
           return  ItemSpecParamType.text
    }
}

export function mergedItemSpecParam(paramsItems: ParamItem[], params2: ItemSpecParam[]): ItemSpecParam[] {

    const map = toMap(params2)
    const newArr: ItemSpecParam[] = []

    for (const item of paramsItems) {
        const p = map.get(item.itemKey as string);
        const newParam: ItemSpecParam = {label: item.itemName, name: item.itemKey, type: toItemSpecParamType(item.valueType), remark: item.description, children: []}
        newArr.push(newParam)
        newParam.value = p?.value
        console.log(item.children, item.children)
        if (item.children) {
            newParam.children = mergedItemSpecParam(item.children, p?.children || [])
        }
    }

    console.log("aaaa:",newArr)
    return newArr
}