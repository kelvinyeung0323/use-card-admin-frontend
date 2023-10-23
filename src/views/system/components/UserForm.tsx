import {Col, Form, Input, Radio, Row, Select, Spin} from "antd";

import {Role, User} from "@/models/sys-model.ts";
import  {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {useForm} from "antd/es/form/Form";
import * as roleService from "@/service/role-service.ts"

import {AvatarUploader} from "@/views/system/components/AvatarUploader.tsx";


interface Props{
    formState?:User
    loading?:boolean
    mode:"edit"|"new"
}



const UserForm=forwardRef(({formState,loading,mode}:Props,ref) =>{

    useImperativeHandle(ref, () => ({
        validate: form.validateFields,
        getData: form.getFieldsValue
    }))

    const [roleOptions,setRoleOptions] = useState<Role[]>()
    const [formLoading,setFormLoading] = useState(false)
    const [form] = useForm()

    const loadRoles=()=> {
        setFormLoading(true)
        roleService.queryRole({pageNum:1,pageSize:100}).then(resp=>{
            if(resp.data){
                setRoleOptions(resp.data)
            }
        }).finally(()=>{
            setFormLoading(false)
        })
    }

    useEffect(() => {
        form.resetFields()
    }, [formState])

    useEffect(() => {
        loadRoles()
    }, []);




    return (
        <>
            <Spin spinning={formLoading||loading}>
            <Form
                form={form}
                name="userForm"
                labelCol={{span: 6}}
                  wrapperCol={{span: 24}}
            initialValues={formState}>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="userName"
                            label="登录名称"
                            rules={[{required: true, message: '登录名称'}]}
                        >
                            <Input disabled={mode=="edit"} placeholder="登录名称"/>
                        </Form.Item>
                    </Col>

                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="nickName"
                            label="用户名称"
                            rules={[{required: true, message: '用户名称'}]}
                        >
                            <Input placeholder="用户名称"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="avatar"
                            rules={[{required:false}]}
                        >
                            <AvatarUploader/>
                        </Form.Item>

                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="password"
                            label="输入密码"
                            rules={[{required: mode=="new", message: '输入密码'}]}
                        >
                            <Input.Password  placeholder={mode==="edit"?"******":"输入密码"}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="roleIds"
                            label="角色"
                            rules={[{required: false, message: '角色'}]}
                        >
                            <Select
                                mode="multiple"
                                fieldNames={{label:'roleName',value:"roleId"}}
                                allowClear
                                style={{width: '100%'}}
                                placeholder=""
                                options={roleOptions}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="enabled"
                            label="状态"
                            rules={[{required: true, message: '状态'}]}
                        >
                            <Radio.Group
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
                        <Form.Item
                            labelCol={{span: 3}}
                            name="remark"
                            label="备注"
                            rules={[
                                {
                                    required: false,
                                    message: '',
                                },
                            ]}
                        >
                            <Input.TextArea rows={4}/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            </Spin>
        </>
    )
})

export default UserForm