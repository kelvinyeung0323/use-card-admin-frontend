import {Cascader} from "antd";
import {Brand, Series} from "@/models/item-common-model.ts";
import * as specService from "@/service/item-spec-service.ts";
import {ItemSpecQueryForm} from "@/models/item-spec-model.ts";
import {useEffect, useState} from "react";
import {useParamContext} from "@/store/sys-param-context.tsx";

const {SHOW_CHILD} = Cascader;

interface VehicleModelOption {
    value?: string | number | null;
    label: React.ReactNode;
    children?: VehicleModelOption[];
    isSeries: boolean
    isLeaf?: boolean;
}

const toVehicleModelOptions = (brands: Brand[]): VehicleModelOption[] => {
    return brands.map(e => {
        return {
            value: e.brandId,
            label: e.brandName,
            children: seriesToVehicleModelOptions(e.series),
            isSeries: false,
            isLeaf: false,
        } as VehicleModelOption
    })
}
const seriesToVehicleModelOptions = (series: Series[]) => {
    return series.map(s => {
        return {
            value: s.seriesId,
            label: s.seriesName,
            children: [],
            isSeries: true,
            isLeaf: false,
        }
    })
}

type VehicleModelCascaderProps = {
    value?: string,
    onChange?: (value: string) => void
}
const VehicleModelCascader = ({value, onChange}: VehicleModelCascaderProps) => {

    const [vehicleModelOptions, setVehicleModelOptions] = useState<VehicleModelOption[]>([]);
    const [cascaderValue, setCascaderValue] = useState<(string | number)[]>([])
    const {brands} = useParamContext()

    useEffect(() => {
        setVehicleModelOptions(toVehicleModelOptions(brands))

    }, [brands])
    const onVehicleModelChange = (data: (string | number)[]) => {
        console.log("onVehicleModelChange:", data)
        if (onChange && data.length > 2) {
            onChange(data[2] as string)
        }
    }

    useEffect(() => {
        if (value && value.length > 0) {
            specService.getSpec(value as string).then(resp => {
                const d = resp.data
                if (d) {
                    setCascaderValue([d.brandId, d.seriesId, value] as (string | number)[])
                    const  b=  vehicleModelOptions.find(e=>d.brandId==e.value)
                    if(b){

                        const s= b.children?.find(e=>e.value == d.seriesId)
                        if(s){
                            if(!s.children ||s.children.length<=0){

                                specService.querySpecs({
                                    pageNum: 1,
                                    pageSize: 1000,
                                    seriesIds: [d.seriesId]
                                } as ItemSpecQueryForm).then(resp => {
                                    resp.data
                                    s.children = resp.data.map(s => {
                                        return {
                                            value: s.specId,
                                            label: s.model,
                                            children: [],
                                            isSeries: false,
                                            isLeaf: true,
                                        } as VehicleModelOption
                                    })
                                    setVehicleModelOptions([...vehicleModelOptions])
                                })
                            }
                        }
                    }

                }
            })
        }
    }, [value,vehicleModelOptions]);


    const loadVehichleModelData = (selectedOptions: VehicleModelOption[]) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        console.log("targetOption", targetOption)
        if (targetOption.isSeries) {
            specService.querySpecs({
                pageNum: 1,
                pageSize: 1000,
                seriesIds: [targetOption.value]
            } as ItemSpecQueryForm).then(resp => {
                resp.data
                targetOption.children = resp.data.map(s => {
                    return {
                        value: s.specId,
                        label: s.model,
                        children: [],
                        isSeries: false,
                        isLeaf: true,
                    } as VehicleModelOption
                })
                setVehicleModelOptions([...vehicleModelOptions])
            })
        }


    }
    return (
        <>
            <Cascader showCheckedStrategy={SHOW_CHILD}
                      options={vehicleModelOptions}
                      loadData={loadVehichleModelData}
                      onChange={onVehicleModelChange} changeOnSelect
                      value={cascaderValue}/>
        </>
    )
}

export default VehicleModelCascader