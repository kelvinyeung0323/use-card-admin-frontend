import React, {createContext, useContext, useEffect, useState} from "react";

import {ParamItem} from "@/models/sys-param-model.ts";
import * as paramService from "@/service/sys-param-service.ts"
import {Brand} from "@/models/item-common-model.ts";
import * as commonService from "@/service/item-common-service.ts"
import {useAuthContext} from "@/store/auth-context.tsx";

export enum  ParamKeyEnum{
    COUNTRIES = "countries", //国别
    CAR_GRADE ="car.grade",
    ENERGY_TYPE ="vehicle.energy.type", //能源类型
    CAR_CONFIG_TEMPLATE="car.configuration.template",
}



type ParamContextType = {
    paramCache:Map<string,ParamItem[]>
    countries:ParamItem[]
    carGrades:ParamItem[]
    carConfigTemplate:ParamItem[]
    loadAllParams:()=>void
    reloadParam:(paramKey:string) =>void
    loadAllBrands:()=>void
    brands:Brand[]
}

export const ParamContext = createContext<ParamContextType | null>(null)


type ContextProviderProps = {
    children: React.ReactNode;
}

export default function ParamContextProvider({children}: ContextProviderProps) {


    const [paramCache, setParamCache]=useState<Map<string,ParamItem[]>>(new Map<string,ParamItem[]>())
    const [countries,setCountries] = useState<ParamItem[]>([])
    const [carGrades,setCarGrades]= useState<ParamItem[]>([])
    const [brands,setBrands] =useState<Brand[]>([])
    const [carConfigTemplate,setCarConfigTemplate] = useState<ParamItem[]>([])
    const {isAuthLoaded} = useAuthContext()
    const loadAllParams=()=>{
        paramService.getAllParamsWithItems().then((resp)=>{
            const map = new Map<string,ParamItem[]>()
            for (const datum of resp.data) {
                if(datum.paramKey&&datum.items){
                    map.set(datum.paramKey,datum.items)
                }
            }
            const c = map.get(ParamKeyEnum.COUNTRIES)
            if(c){
                setCountries(c)
            }
            const g = map.get(ParamKeyEnum.CAR_GRADE)
            if(g){
                setCarGrades(g)
            }
            const tmpl = map.get(ParamKeyEnum.CAR_CONFIG_TEMPLATE)
            if(tmpl){
                setCarConfigTemplate(tmpl)
            }
            setParamCache(map)
        })

    }

    const reloadParam=(paramKey:string)=>{
        paramService.getParamWithItemsByKey(paramKey).then(resp=>{
            if(resp.data.paramKey&&resp.data.items){
                paramCache.set(resp.data.paramKey,resp.data.items)
                setParamCache({...paramCache,[resp.data.paramKey]:resp.data.items})
            }

        })
    }

    const loadAllBrands=()=>{
        commonService.getAllBrandsWithSeries().then(resp=>{
            setBrands(resp.data)
        })
    }

    useEffect(() => {
        if(isAuthLoaded){
            loadAllParams()
            loadAllBrands()
        }

    }, [isAuthLoaded]);



    return (
        <ParamContext.Provider
            value={{countries,carGrades,carConfigTemplate,reloadParam,brands,paramCache,loadAllParams,loadAllBrands}}>
            {children}
        </ParamContext.Provider>
    )
}

export function useParamContext() {
    const context = useContext(ParamContext)
    if (!context) {
        throw new Error(
            "useAuthContext must be used within a ParamContextProvider"
        );
    }
    return context
}
