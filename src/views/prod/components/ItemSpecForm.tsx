import {Col, Form, Input, InputNumber, Row, Select, Spin} from "antd";

import {forwardRef, useEffect, useImperativeHandle, useState} from "react";


import {ItemSpec, ItemSpecParam, ItemSpecParamType} from "@/models/item-spec-model.ts";

import {useForm} from "antd/es/form/Form";
import {useParamContext} from "@/store/sys-param-context.tsx";
import {ParamItem} from "@/models/sys-param-model.ts";

import locale from "antd/es/date-picker/locale/zh_CN";
import KDatePicker from "@/components/KDatePicker.tsx";


type CompProps = {
    onChange?: (val: ItemSpecParam) => void
    value?: ItemSpecParam
}
const SpecParamComp = ({value, onChange}: CompProps) => {

    const onValueChange = (val: string) => {
        if (onChange) {
            onChange({...value, value: val} as ItemSpecParam)
        }
    }
    const width = 150
    switch (value?.type) {
        case ItemSpecParamType.number:
            return (<InputNumber key={value.name} style={{width: width}} value={value.value}
                                 onChange={val => onValueChange(val as string)}/>)
        case ItemSpecParamType.text:
            return (<Input key={value.name} style={{width: width}} value={value.value}
                           onChange={(e) => onValueChange(e.target.value)}/>)
        default:
            return (<Input key={value?.name} style={{width: width}} value={value?.value}
                           onChange={(e) => onValueChange(e.target.value)}/>)
    }

}


const SpecParamGroupComp = ({value, onChange}: CompProps) => {

    const onValueChange = (index: number, val: ItemSpecParam) => {
        if (value && value.children && onChange) {
            value.children[index] = val
            onChange(value)
        }

    }
    return (
        <>
            <div>
                <Row><h3>{value?.label}</h3></Row>
                <Row gutter={8}>
                    {value?.children?.map((child, i) => (

                        <Col span={12} key={child.name}>

                            <Form.Item
                                label={child.label}
                                labelCol={{span: 12}}
                                wrapperCol={{span: 24}}
                            >
                                <SpecParamComp key={child.name} value={child}
                                               onChange={(val) => onValueChange(i, val)}/>
                            </Form.Item>
                        </Col>
                    ))}

                </Row>
            </div>

        </>
    )
}
type ParamsRendererProps = {
    onChange?: (value: ItemSpecParam[]) => void
    value?: ItemSpecParam[]
}
const ParamsRenderer = ({value, onChange}: ParamsRendererProps) => {
    const onValueChange = (index: number, val: ItemSpecParam) => {
        if (value && onChange) {
            value[index] = val
            onChange(value)
        }
    }
    return (
        <>
            {value?.map((item, i) => (
                <SpecParamGroupComp key={i} value={item} onChange={(val) => onValueChange(i, val)}/>
            ))}
        </>
    )

}


interface ItemSpecFormProps {
    formState?: ItemSpec
    loading?: boolean
    mode: "edit" | "new"
}

const ItemSpecForm = forwardRef(({formState, loading}: ItemSpecFormProps, ref) => {

    const [form] = useForm()
    const {brands} = useParamContext()
    const [seriesItems, setSeriesItems] = useState<ParamItem[]>()
    useImperativeHandle(ref, () => ({
        validate: form.validateFields,
        getData: form.getFieldsValue
    }))

    const onBrandChange = (value: number) => {
        const ls = brands.filter(e => e.brandId === value)
        setSeriesItems(ls[0]?.series)
    }

    useEffect(() => {
        onBrandChange(formState?.brandId as number)
        form.resetFields()
    }, [formState]);
    const onFinish = (values: ItemSpec) => {
        console.log(values)
    }
    return (
        <>
            <Spin spinning={loading}>
                <Form
                    form={form}
                    labelCol={{span: 6}}
                    wrapperCol={{span: 24}}
                    onFinish={onFinish}
                    initialValues={formState}
                >

                    <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item
                                label="品牌"
                                name="brandId"
                            >
                                <Select options={brands}
                                        onChange={onBrandChange}
                                        fieldNames={{label: "brandName", value: "brandId"}}
                                >
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="车系"
                                name="seriesId">
                                <Select options={seriesItems}
                                        fieldNames={{label: "seriesName", value: "seriesId"}}
                                >
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item
                                label="年份"
                                name="year">
                                <KDatePicker locale={locale} picker="year" format={"YYYY"}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="车型"
                                name="model">
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Form.Item
                            label=""
                            name="params"
                        >
                            <ParamsRenderer/>
                        </Form.Item>
                    </Row>


                </Form>
            </Spin>
        </>
    )
})
export default ItemSpecForm