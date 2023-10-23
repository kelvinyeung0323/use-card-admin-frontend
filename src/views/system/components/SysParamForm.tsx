import {Form, Input, Spin} from "antd";


import {forwardRef, useEffect, useImperativeHandle} from "react";
import {SysParam} from "@/models/sys-param-model.ts";
import {useForm} from "antd/es/form/Form";



type PropertyFormProps = {
    mode: "edit" | "new"
    formData?: SysParam
    loading?: boolean
}


const SysParamForm = forwardRef(({formData, loading}: PropertyFormProps, ref) => {

    const [form] = useForm()

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
                        label="参数名称"
                        name="paramName"
                        rules={[{required: true, message: '参数名称'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="参数主键"
                        name="paramKey"
                        rules={[{required: true, message: '参数主键'}]}
                    >
                        <Input/>
                    </Form.Item>

                </Form>
            </Spin>
        </>
    )
})

export default SysParamForm