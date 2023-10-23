import {DatePicker} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";


type KDateRangePickerProps = {
    value?:[number|null,number|null]|null
    onChange?:(values: [number,number]|null,formatString:[string,string]) => void;
}
const KDateRangePicker = ({value,onChange}:KDateRangePickerProps) =>{

    const [rangeData,setRangeData]=useState<[dayjs.Dayjs|null,dayjs.Dayjs|null]|null>()

   const onValueChange=(dateRange:[dayjs.Dayjs|null,dayjs.Dayjs|null]|null,formatString:[string,string])=>{
       let r :[number,number]|null = null
       const startAt = dateRange&&dateRange.length > 1 ? dayjs(dateRange[0]).startOf("date").valueOf(): null ;
       const endAt = dateRange&&dateRange.length > 1 ? dayjs(dateRange[1]).endOf("date").valueOf() : null;
       if (startAt&& endAt){
           r=[startAt,endAt]
       }
       if(onChange)onChange(r,formatString)
    }
    useEffect(() => {
        const t:[dayjs.Dayjs|null,dayjs.Dayjs|null]=[null,null]
        if(!value){
            setRangeData(null)
        }else{
            if(value[0]){
                t[0]=dayjs(value[0])
            }
            if(value[1]){
                t[1]=dayjs(value[1])
            }
            setRangeData(t)
        }
    }, [value]);

    return (
        <>
            <DatePicker.RangePicker value={rangeData} onChange={onValueChange}/>
        </>
    )
}

export default KDateRangePicker