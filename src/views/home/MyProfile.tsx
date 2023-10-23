import {Avatar, Button, Card, Col, Divider, Form, Input, message, Row, Space, Tabs, TabsProps} from "antd";


import "./MyProfile.less"
import {UserOutlined,CrownOutlined,FontColorsOutlined} from "@ant-design/icons";
import {useAuthContext} from "@/store/auth-context.tsx";
import {User} from "@/models/sys-model.ts";
import * as authService from "@/service/auth-service.ts"
const MyProfile = () => {



    const {curUser,loadAuthInfo} = useAuthContext()


    const onUpdateProfile=(user:User)=>{
        authService.updateProfile(user).then(()=>{
            message.info("修改用户信息成功")
            loadAuthInfo()
        })
    }
    const onChangePwd=(form:{oldPwd:string,newPwd:string})=>{


        authService.changePwd(form.oldPwd,form.newPwd).then(()=>{
            message.info("修改密码成功，重新登录，新密码将会生效！")
        })
    }

    const onCloseProfile=()=>{
        history.back()
    }

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '基本资料',
            children: (
                <>
                    <Form
                        onFinish={onUpdateProfile}
                        labelCol={{span:4}}
                        wrapperCol={{span:10}}
                        initialValues={curUser as User}
                    >
                        <Form.Item
                            name="nickName"
                            label="用户昵称">
                            <Input/>
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">保存</Button>
                                <Button type="primary" danger onClick={onCloseProfile}>关闭</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </>
            ),
        },
        {
            key: '2',
            label: '修改密码',
            children: (
                <>
                    <Form
                        onFinish={onChangePwd}
                        labelCol={{span:4}}
                        wrapperCol={{span:10}}
                    >
                        <Form.Item
                            label="旧密码"
                            name="oldPwd"
                            rules={[{required: true}]}
                        >
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item
                            label="新密码"
                            name="newPwd"
                            rules={[{required: true},]}
                        >
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item
                            label="确认密码"
                            name="confirmPwd"
                            dependencies={['newPwd']}
                            rules={[{required: true},({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPwd') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('密码不一致'));
                                },
                            })]}
                        >

                            <Input.Password/>
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">保存</Button> <Button type="primary" danger onClick={onCloseProfile}>关闭</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </>
            ),
        }
    ];


    return (
        <>
            <Row gutter={8}>
                <Col span={8}>

                    <Card title="个人信息" className="profile-info">
                        <Row className="avatar-box">
                            <div style={{width:"100%", display:"flex", justifyContent:"center",alignItems:"center"}}>
                                <Avatar size={120} icon={<UserOutlined />}>
                                </Avatar>
                            </div>
                        </Row>
                        <Row className="body">
                             <Col span={12} className="title">
                                <UserOutlined/> <span> 用户名称</span>
                             </Col>
                            <Col span={12} className="content">
                                 <span >{curUser?.userName}</span>
                            </Col>

                        </Row>
                        <Divider className="divider"/>
                        <Row className="row">
                            <Col span={12} className="title">
                                <FontColorsOutlined /><span> 用户昵称</span>
                            </Col>
                            <Col span={12} className="content">
                                <span >{curUser?.nickName}</span>
                            </Col>
                        </Row>
                        <Divider orientationMargin={1} className="divider"/>
                        <Row className="row">
                            <Col span={12} className="title">
                                <CrownOutlined /><span> 角色</span>
                            </Col>
                            <Col span={12} className="content">
                                <span >{curUser?.roles?.map(r=>{r.roleName}).join(",")}</span>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={16}>
                    <Card title="基本资料">
                        <Tabs items={items}>

                        </Tabs>
                    </Card>

                </Col>
            </Row>
        </>
    )
}

export default MyProfile