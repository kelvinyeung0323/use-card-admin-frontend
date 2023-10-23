import {DatePicker} from "antd";
import {PickerLocale} from "antd/es/date-picker/generatePicker";
import {useEffect, useState} from "react";
import dayjs from "dayjs";

type KDatePickerProps ={
    picker?:"time" | "date" | "week" | "month" | "quarter" | "year"
    format?:string
    locale?:PickerLocale
    value?:string|number
    onChange?:(val:string)=>void
    placeholder?:string
}
const KDatePicker=({value,picker,onChange,locale,format,placeholder}:KDatePickerProps)=>{

    const [dateValue,setDateValue] = useState<dayjs.Dayjs|null>()
    useEffect(() => {
        if(!value){
            setDateValue(null)
        }else if (typeof value == "number"){
            // setDateValue(dayjs.unix(value))
             setDateValue(dayjs(value))
        }else {
            setDateValue(dayjs(value, format))
        }
    }, [value]);

const onDatePickerChange=(value: dayjs.Dayjs | null) =>{
    if(onChange)
    onChange(value?value.format(format):"")
}

    return (
        <>
            <DatePicker picker={picker} placeholder={placeholder} locale ={locale} value={dateValue} format={format} onChange={onDatePickerChange}/>
        </>
    )
}

export default KDatePicker