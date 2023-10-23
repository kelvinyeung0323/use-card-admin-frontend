import {Checkbox, Col, Form, Input, InputNumber, Radio, Row, Spin, TreeSelect} from "antd";

import {Res, ResType} from "@/models/sys-model.ts";
import {IconSelectComponent} from "./IconComponent.tsx";
import {observer} from "mobx-react-lite";
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {useForm} from "antd/es/form/Form";


interface Props {
    formState: Res,
    resList: Res[],
    loading?: boolean,
}

const treeRootNode: Res = {
    resId: "root",
    parentId: "",
    resType: ResType.Catalog,
    resName: "主类目",
    children: []
}
const ResForm = forwardRef(({formState, resList, loading}: Props, ref) => {
    useImperativeHandle(ref, () => ({
        validate: form.validateFields,
        getData: form.getFieldsValue
    }))


    const [formLayout, setFormLayout] = useState(ResType.Catalog)

    const resTypeOptions = [
        {label: "目录", value: ResType.Catalog},
        {label: "菜单", value: ResType.Menu},
        {label: "按钮", value: ResType.Button},

    ]

    const [treeData, setTreeData] = useState<Res[]>([treeRootNode])


    const [form] = useForm()

    useEffect(() => {
        treeRootNode.children = resList
        setTreeData([treeRootNode])
        setFormLayout(formState.resType||ResType.Catalog)
        form.resetFields()
    }, [formState, resList])


    return (

        <>
            <Spin spinning={loading}>
                <Form
                    form={form}
                    name="resForm"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    initialValues={formState}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="parentId"
                                label="上级菜单"
                                rules={[{required: true, message: '上级菜单'}]}
                            >
                                <TreeSelect
                                    showSearch
                                    style={{width: '100%'}}
                                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                    placeholder="请选择上级菜单"
                                    allowClear
                                    fieldNames={{label: "resName", value: "resId", children: "children"}}
                                    treeDefaultExpandAll
                                    treeData={treeData}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="enabled"
                                label="菜单状态"
                                rules={[{required: true, message: '状态'}]}
                            >
                                <Radio.Group
                                    buttonStyle="solid"
                                >
                                    <Radio value={true}>启用</Radio>
                                    <Radio value={false}>停用</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="resType"
                                label="菜单类型"
                                rules={[{required: true, message: '菜单类型'}]}
                            >
                                <Radio.Group
                                    options={resTypeOptions}
                                    optionType="button"
                                    buttonStyle="solid"
                                    onChange={(e) => setFormLayout(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="visible"
                                label="显示/隐藏"
                                valuePropName="checked"
                                tooltip={"隐藏菜单将在页面不展示此菜单，但路由仍可以访问"}
                                rules={[{required: true, message: '显示/隐藏菜单'}]}
                            >
                                <Checkbox/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        {formLayout != ResType.Button?(
                            <Col span={12}>
                                <Form.Item

                                    name="icon"
                                    label="菜单图标"
                                    rules={[{required: true, message: '菜单图标'}]}
                                >
                                    <IconSelectComponent/>
                                </Form.Item>
                            </Col>
                        ):""
                        }

                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="resName"
                                label="菜单名称"
                                rules={[{required: true, message: '菜单名称'}]}
                            >
                                <Input type="primary"/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="sort"
                                label="显示顺序"
                                rules={[{required: true, message: '显示顺序'}]}
                            >
                                <InputNumber type="primary"/>
                            </Form.Item>
                        </Col>

                        {formLayout != ResType.Button?(
                            <Col span={12} >
                                <Form.Item

                                    name="url"
                                    label="路由地址"
                                    tooltip="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                                    rules={[{required: true, message: '路由地址'}]}
                                >
                                    <Input type="primary"/>
                                </Form.Item>
                            </Col>
                        ):""}

                        {
                            formLayout == ResType.Menu?(
                                <Col span={12}>
                                    <Form.Item
                                        name="component"
                                        label="组件路径"
                                        rules={[{required: true, message: '组件路径'}]}
                                    >
                                        <Input type="primary"/>
                                    </Form.Item>
                                </Col>
                            ):""
                        }

                        {formLayout == ResType.Menu ?
                            (
                                <Col span={12}>
                                    <Form.Item
                                        name="urlPrams"
                                        label="路由参数"
                                        rules={[{required: false, message: '路由参数'}]}
                                    >
                                        <Input type="primary"/>
                                    </Form.Item>
                                </Col>
                            ):""
                        }

                        {
                            formLayout != ResType.Catalog?(
                                <Col span={12}>
                                    <Form.Item
                                        name="authCode"
                                        label="权限标识"
                                        rules={[{required: true, message: '权限标识'}]}
                                    >
                                        <Input type="primary"/>
                                    </Form.Item>
                                </Col>
                            ):""
                        }

                    </Row>
                </Form>
            </Spin>
        </>

    )
})

export default observer(ResForm)