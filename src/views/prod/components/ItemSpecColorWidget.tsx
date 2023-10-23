import {ItemSpecColor} from "@/models/item-spec-model.ts";
import {Button, ColorPicker, Input, Space} from "antd";
import {useEffect, useState} from "react";


export type WidgetMode = "view" | "edit"
type ViewFormProps = {
    value?: ItemSpecColor
    onClick: () => void
}
const ViewForm = ({value, onClick}: ViewFormProps) => {
    return (
        <>
            <Space onClick={onClick}>
                <ColorPicker defaultValue="#ffffff" disabled value={value?.value} style={{cursor:"pointer"}}/>
                <a><span>{value?.name}</span></a>
            </Space>
        </>
    )
}
type EditFormProps = {
    value?: ItemSpecColor
    onFinish?: (val: ItemSpecColor) => void
    onCancel?: () => void
}
const EditForm = ({value, onFinish, onCancel}: EditFormProps) => {
    const [colorName, setColorName] = useState("")
    const [colorValue, setColorValue] = useState("")

    const onEditFinish = () => {
        if (onFinish) {
            const val:ItemSpecColor = {...value,value:colorValue,name:colorName}
            onFinish(val)
        }
    }
    useEffect(() => {
        setColorValue(value?.value||"#ffff")
        setColorName(value?.name||"白色")
    }, [value]);

    return (
        <>
            <Space>
                <ColorPicker defaultValue="#ffffff" showText value={colorValue}
                             onChange={(_, hex) => setColorValue(hex)}/>
                <Input value={colorName} placeholder="颜色名称" style={{width: 150}}
                       onChange={(e) => setColorName(e.target.value)}/>
                <Button size="small" onClick={() => onCancel ? onCancel() : null}>取消</Button>
                <Button size="small" type="primary" onClick={() => onEditFinish()}>完成</Button>
            </Space>
        </>
    )
}


type Props = {
    value?: ItemSpecColor,
    onFinish?: (val: ItemSpecColor) => void
    mode?: WidgetMode
}
const ItemSpecColorWidget = ({value, mode, onFinish}: Props) => {



    const [compMode, setComMode] = useState<WidgetMode>("view")
    useEffect(() => {

    }, [value]);
    useEffect(() => {
        setComMode(mode||"view")
        console.log("mode change......")
    }, [mode]);
    return (
        <>
            {compMode == "edit" ? <EditForm value={value} onFinish={onFinish} onCancel={() => setComMode("view")}/> :
                <ViewForm onClick={() => setComMode("edit")} value={value}/>}
        </>
    )
}


export default ItemSpecColorWidget