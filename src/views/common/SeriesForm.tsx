import {Form, Input, Select, Spin, TreeSelect} from "antd";

import {forwardRef, useEffect, useImperativeHandle} from "react";

import {useForm} from "antd/es/form/Form";
import {Series} from "@/models/item-common-model.ts";
import TextArea from "antd/es/input/TextArea";
import {AvatarUploader} from "@/views/system/components/AvatarUploader.tsx";
import {useParamContext} from "@/store/sys-param-context.tsx";



type PropertyFormProps = {
    mode: "edit" | "new"
    formData?: Series
    loading?: boolean
}


const SeriesForm = forwardRef(({formData, loading}: PropertyFormProps, ref) => {

    const [form] = useForm()
    const {brands,carGrades} = useParamContext()
    useImperativeHandle(ref, () => ({
        validate: form.validateFields,
        getData: form.getFieldsValue
    }))

    useEffect(() => {
        form.resetFields()
    }, [formData]);


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
                        label="车系主图"
                        name="image"
                        rules={[{required:false}]}
                    >
                        <AvatarUploader/>
                    </Form.Item>
                    <Form.Item
                        label="车系名称"
                        name="seriesName"
                        rules={[{required: true, message: '车系名称'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="品牌"
                        name="brandId"
                        rules={[{required: true, message: '国别'}]}
                    >
                        <Select
                            fieldNames={{label:"brandName",value:"brandId"}}
                            options={brands}
                        />
                    </Form.Item>
                    <Form.Item
                        label="级别"
                        name="grade"
                        rules={[{required: true, message: '级别'}]}
                    >
                        <TreeSelect
                            fieldNames={{label:"itemName",value:"itemKey"}}
                            treeData={carGrades}
                        />
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

export default SeriesForm