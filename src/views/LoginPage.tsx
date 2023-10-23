import {Button, Checkbox, Form, Input} from "antd";


import "./LoginPage.less"

import {UserOutlined,LockOutlined} from "@ant-design/icons";
import {LoginForm} from "@/models/sys-model.ts";
import {useAuthContext} from "@/store/auth-context.tsx";
import {useState} from "react";



export default function LoginPage() {

    const [loading,setLoading] =useState(false)
    const {login} = useAuthContext()

    const doLogin = (form:LoginForm) => {
        setLoading(true)
        login(form).finally(()=>setLoading(false))
    }
    return (
        <>
            <div className="page">

                <div className="form">
                    <h1 className="title">{import.meta.env.VITE_APP_TITLE}</h1>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={doLogin}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: '请输入你的用户名称!' }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名称" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入密码!' }]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>记住我</Checkbox>
                            </Form.Item>

                            <a className="login-form-forgot" href="#">
                                忘记密码
                            </a>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

            </div>
        </>
    )
}