import {Form, Input, Select, Spin} from "antd";

import {forwardRef, useEffect, useImperativeHandle, useState} from "react";

import {useForm} from "antd/es/form/Form";
import {Brand} from "@/models/item-common-model.ts";
import TextArea from "antd/es/input/TextArea";
import {AvatarUploader} from "@/views/system/components/AvatarUploader.tsx";
import {ParamKeyEnum, useParamContext} from "@/store/sys-param-context.tsx";
import {ParamItem} from "@/models/sys-param-model.ts";



type PropertyFormProps = {
    mode: "edit" | "new"
    formData?: Brand
    loading?: boolean
}


const BrandForm = forwardRef(({formData, loading}: PropertyFormProps, ref) => {

    const [form] = useForm()
    const [countries,setCountries] = useState<ParamItem[]>()
    const {paramCache}=useParamContext()

    useImperativeHandle(ref, () => ({
        validate: form.validateFields,
        getData: form.getFieldsValue
    }))

    useEffect(() => {
        setCountries(paramCache.get(ParamKeyEnum.COUNTRIES))
        console.log(countries)
        form.resetFields()
    }, [formData,paramCache]);


    return (
        <>
            <Spin spinning={loading}>
                <Form
                    form={form}
                    labelCol={{span: 4}}
                    wrapperCol={{span: 12}}
                    initialValues={formData}
                >
                    <Form.Item
                        label="品牌logo"
                        name="brandLogo"
                        rules={[{required:false}]}
                    >
                        <AvatarUploader/>
                    </Form.Item>
                    <Form.Item
                        label="品牌名称"
                        name="brandName"
                        rules={[{required: true, message: '品牌名称'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="国别"
                        name="country"
                        rules={[{required: true, message: '国别'}]}
                    >
                        <Select
                            fieldNames={{label:"itemName",value:"itemKey"}}
                            options={countries}>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="备注"
                        name="remark"
                        rules={[{required: false, message: '备注'}]}
                    >
                        <TextArea/>
                    </Form.Item>
                </Form>
            </Spin>
        </>
    )
})

export default BrandForm