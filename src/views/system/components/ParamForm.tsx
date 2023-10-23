import {Form, Input, InputNumber, Select, Spin, Switch, TreeSelect} from "antd";


import JsonEditor from "@/components/JsonEditor.tsx";
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {ParamItem, SysParamType} from "@/models/sys-param-model.ts";
import {useForm} from "antd/es/form/Form";


const {Option} = Select
const {TextArea} = Input


type InputComponentProps = {
    type: SysParamType
    value?: string
    onChange?: (value: string | null) => void
}
const InputComponent = ({value, onChange, type}: InputComponentProps) => {
    switch (type) {
        case SysParamType.json:
            return <JsonEditor value={value} onChange={onChange}/>
        case SysParamType.text:
            return <TextArea style={{height: 600}} value={value}
                             onChange={e => onChange ? onChange(e.target.value) : null}/>
        case SysParamType.boolean:
            return <Switch checked={value?.toLowerCase() == "true"}
                           onChange={e => onChange ? onChange(e.toString()) : null}/>
        case SysParamType.number:
            return <InputNumber value={value} onChange={e => onChange ? onChange(e) : null}/>
        default:
            return <Input value={value} onChange={e => onChange ? onChange(e.target.value) : null}/>
    }
}

type PropertyFormProps = {
    mode: "edit" | "new"
    allItems:ParamItem[]
    formData?: ParamItem
    loading?: boolean
}
const treeRootNode: ParamItem = {
    itemId: "root",
    parentId: "",
    itemName: "主类目",
    children: []
}

const ParamItemForm = forwardRef(({formData,allItems, loading, mode}: PropertyFormProps, ref) => {
    const [paramType, setParamType] = useState<SysParamType>(SysParamType.string)
    const [form] = useForm()
    const [treeData, setTreeData] = useState<ParamItem[]>([treeRootNode])
    useImperativeHandle(ref, () => ({
        validate: form.validateFields,
        getData: form.getFieldsValue
    }))

    useEffect(() => {

        treeRootNode.children = allItems
        setTreeData([treeRootNode])
        setParamType(formData?.valueType as SysParamType)
        form.resetFields()
    }, [formData,allItems]);


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
                        name="parentId"
                        label="上级条目"
                        rules={[{required: true, message: '上级条目'}]}
                    >
                        <TreeSelect
                            defaultValue="root"
                            showSearch
                            style={{width: '100%'}}
                            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                            placeholder="请选择上级条目"
                            allowClear
                            fieldNames={{label: "itemName", value: "itemId", children: "children"}}
                            treeDefaultExpandAll
                            treeData={treeData}
                        />
                    </Form.Item>
                    <Form.Item
                        label="条目名称"
                        name="itemName"
                        rules={[{required: true, message: '参数名称'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="条目键名"
                        name="itemKey"
                        rules={[{required: true, message: '参数主键'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="键值类型"
                        name="valueType"
                        rules={[{required: true, message: '参数类型'}]}
                    >
                        <Select onChange={(value) => setParamType(value)} disabled={mode == "edit"}>
                            <Option value={SysParamType.json} key={1}>JSON</Option>
                            <Option value={SysParamType.string} key={2}>字符串</Option>
                            <Option value={SysParamType.text} key={3}>文本</Option>
                            <Option value={SysParamType.boolean} key={4}>布尔值</Option>
                            <Option value={SysParamType.number} key={5}>数值</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        labelCol={{span: 4}}
                        wrapperCol={{span: paramType == SysParamType.string ? 12 : 24}}
                        label="条目键值"
                        name="itemValue"
                    >
                        <InputComponent
                            type={paramType}/>
                    </Form.Item>
                </Form>
            </Spin>
        </>
    )
})

export default ParamItemForm