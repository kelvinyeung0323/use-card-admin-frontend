import {IPageable} from "@/models/sys-model.ts";
import dayjs from "dayjs";
import {MediaType} from "@/models/item-spec-model.ts";


export type ProdItem = {
    itemId?: string
    medias?: ItemMedia[]
    itemCode?: string
    title?: string
    subTitle?: string
    UsageNature?: string //使用性质
    emissionStd?: string //排放标准
    displacement?: string// 排量
    gearbox?: string //变速箱
    bodyColor?: string //车身颜色
    belongingPlace?: string//所属地
    belongingPlaceArr?: string[]
    mileage?: string //行驶里程
    registrationDate?: string | dayjs.Dayjs//
    annualCheckDate?: string | dayjs.Dayjs//
    insuranceExpiredDate?: string | dayjs.Dayjs
    usageTaxValidDate?: string | dayjs.Dayjs
    onSale?: boolean
    startDate?: string
    endDate?: string
    createdAt?: string
    createdBy?: string
    updatedAt?: string
    updateBy?: string

}

export type ProdItemQueryForm = IPageable & {
    title?: string
    subTitle?: string
    UsageNature?: string //使用性质
    emissionStd?: string //排放标准
    displacement?: string// 排量
    gearbox?: string //变速箱
    bodyColor?: string //车身颜色
    belongingPlace?: string//所属地
    mileage?: string //行驶里程
    registrationDate?: string //
    annualCheckDate?: string//
    insuranceExpiredDate?: string
    usageTaxValidDate?: string
    createdTimeRange?: number[]
}


export type ItemMedia = {
    mediaId?: string
    itemId?: string
    mediaType?: MediaType
    thumbnail?: string
    location: string
}