import {Card, Checkbox, Col, Form, Input, Radio, Row, Spin, Tree,} from "antd";
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import TextArea from "antd/es/input/TextArea";
import {Res, ResQueryForm, Role} from "../../../models/sys-model.ts";
import {useForm} from "antd/es/form/Form";

import * as resService from "@/service/res-service.ts"
import {CheckboxChangeEvent} from "antd/es/checkbox";


interface Props {
    formState: Role,
    loading?: boolean,
}
const getAllResIds = (res:Res[]):string[]=>{
    const arr:string[] = []
    res.forEach((res)=>{
        arr.push(res.resId)
        if(res.children){
           const sub = getAllResIds(res.children)
            arr.push(...sub)
        }
    })
    return arr;
}

const RoleForm = forwardRef(({formState, loading}: Props, ref) => {

    useImperativeHandle(ref, () => ({
        validate: form.validateFields,
        getData: form.getFieldsValue
    }))


    const [roleEnabled] = useState(true)
    const [treeData, setTreeData] = useState<Res[]>()
    const [form] = useForm()
    const [loading2, setLoading2] = useState(false)

    const [checkStrictly,setCheckStrictly] = useState(false)
    const [expandedKeys,setExpandedKeys] = useState<string[]>()
    const [allResIds,setAllResIds] = useState<string[]>([])
    const loadRes = () => {
        setLoading2(true)
        resService.queryRes({resName: null, resType: null} as ResQueryForm).then(resp => {
            setTreeData(resp.data)
            setAllResIds(getAllResIds(resp.data))
        }).finally(() => {
            setLoading2(false)
        })
    }
    useEffect(() => {
        loadRes()
        form.resetFields()
    }, [formState])

    useEffect(() => {
        form.resetFields
    }, [treeData]);
    const onSelectAll = (e: CheckboxChangeEvent) => {
        console.log("onSelect all", e.target.checked)
        if (e.target.checked) {
                form.setFieldValue("resIds",allResIds)
        }else {
            form.setFieldValue("resIds",[])
        }
    }

    const onExpandAll =(e:CheckboxChangeEvent)=>{
        if(e.target.checked){
               setExpandedKeys(allResIds)
        }else {
          setExpandedKeys([])
        }
    }

    const onExpand = (expandedKeys: string[])=>{
        setExpandedKeys(expandedKeys)
    }
    return (

        <>
            <Spin spinning={loading || loading2}>
                <Form
                    form={form}
                    name="roleForm"
                    labelCol={{span: 4}}
                    wrapperCol={{span: 16}}
                    initialValues={formState}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="roleName"
                                label="角色名称"
                                rules={[{required: true, message: '角色名称'}]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="authCode"
                                label="权限标识"
                                rules={[{required: true, message: '权限标识'}]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="enabled"
                                label="状态"
                                rules={[{required: true, message: '状态'}]}
                            >
                                <Radio.Group
                                    value={roleEnabled}
                                    buttonStyle="solid"
                                >
                                    <Radio value={true}>正常</Radio>
                                    <Radio value={false}>停用</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>


                    <Row gutter={16}>

                        <Col span={24}>
                            <Form.Item label="菜单权限">
                                <Row>
                                    <Checkbox defaultChecked={true} onChange={onExpandAll}>展开/折叠</Checkbox>
                                    <Checkbox defaultChecked={false} onChange={onSelectAll}>全选/全不选</Checkbox>
                                    <Checkbox checked={checkStrictly} onChange={e=>setCheckStrictly(e.target.checked)}>父子联动</Checkbox>

                                </Row>
                                <Row>
                                    <Card style={{width: '100%'}}>
                                        <Form.Item
                                            label=""
                                            name="resIds"
                                            valuePropName="checkedKeys"
                                            trigger="onCheck"
                                            rules={[{required: false, message: '菜单权限'}]}
                                        >
                                            <Tree
                                                checkStrictly={!checkStrictly}
                                                expandedKeys={expandedKeys}
                                                onExpand={(keys)=>onExpand(keys as string[])}
                                                multiple={true}
                                                checkable
                                                fieldNames={{title: "resName", key: "resId", children: "children"}}
                                                defaultExpandAll={true}
                                                treeData={treeData}
                                            />
                                        </Form.Item>
                                    </Card>
                                </Row>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="remark"
                                label="备注"
                                rules={[{required: false, message: '备注备注'}]}
                            >
                                <TextArea/>
                            </Form.Item>
                        </Col>

                    </Row>
                </Form>
            </Spin>
        </>

    )
})

export default RoleForm