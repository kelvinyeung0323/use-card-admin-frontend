import {
    Button,
    DatePicker,
    Drawer,
    Form,
    Input,
    message, Modal, Pagination,
    Popconfirm,
    Row,
    Select,
    Space,
    Switch,
    Table,
    Tag
} from "antd";
import {
    PlusOutlined,
    MinusOutlined,
    SearchOutlined,
    RedoOutlined,
    FormOutlined,
    DeleteOutlined,
    KeyOutlined
} from "@ant-design/icons";
import React, {useEffect, useState} from "react";


import * as userService from "@/service/user-service.ts";
import {Role, User, UserQueryForm} from "@/models/sys-model.ts";
import dayjs from 'dayjs'
import {useForm} from "antd/es/form/Form";
import UserForm from "./components/UserForm.tsx";

const {Column} = Table;
const {Option} = Select;


const initailForm: User = {
    userId: "",
    userName: "",
    password: "",
    nickName: "",
    enabled: true,
    createdAt: "",
    updatedAt: "",
    remark: "",
    roles: [],
    roleIds: [],

}

type FormMode = "new" | "edit"

interface FormRef {
    validate: () => Promise<User>
    getData: () => User[]
}

function UserManagement() {

    useEffect(() => {
        loadUsers()
    }, []);


    const [selectionType] = useState<'checkbox' | 'radio'>('checkbox');
    const [dataSource, setDataSource] = useState<User[]>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
    const [tableLoading, setTableLoading] = useState(false)
    const [formMode, setFormMode] = useState<FormMode>("new")
    const [drawerTitle, setDrawerTitle] = useState("添加用户")
    const formRef = React.createRef<FormRef>()
    const [drawerLoading, setDrawerLoading] = useState(false)
    const [formState, setFormState] = useState<User>()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalUsers, setTotalUsers] = useState(0)
    const [isPasswdModalOpen, setIsPasswdModalOpen] = useState(false)

    const [changePasswordUser, setChangePasswordUser] = useState<User | null>(null)
    const [passwordForm] = useForm()
    const openDrawer = (mode: FormMode, userId: string) => {
        setFormMode(mode)
        console.log("open drawer,mode", formMode)
        if (mode == "edit") {
            setDrawerTitle("修改用户")
            setIsDrawerOpen(true)
            setDrawerLoading(true)
            userService.getUser(userId).then(resp => {
                console.log("resp:", resp)
                if (resp.data) {
                    resp.data.roleIds = resp.data.roles?.map(e => e.roleId) as string[]
                    setFormState(resp.data)
                }
            }).finally(() => setDrawerLoading(false))
        } else {
            setDrawerTitle("添加用户")
            setFormState({...initailForm})
            setIsDrawerOpen(true)

        }

    }


    const onDrawerClose = () => {
        setIsDrawerOpen(false)
    }
    const queryForm: UserQueryForm = {
        pageNum: 1,
        pageSize: 10,
        userName: null,
        enabled: null,
        startAt: null,
        endAt: null,


    }
    const loadUsers = () => {
        setTableLoading(true)
        userService.queryUser(queryForm).then(resp => {
            console.log("data", resp)
            if (resp.data) {
                setDataSource(resp.data)
                setCurrentPage(resp.pageNum || 1)
                setTotalUsers(resp.total || 0)
            }

        }).finally(() => setTableLoading(false))
    }


    const doQuery = (values: { userName: string, enabled: boolean, dateRange: number[] }) => {

        queryForm.pageNum = 1
        queryForm.userName = values.userName;
        queryForm.enabled = values.enabled;
        const dateRange = values.dateRange;

        queryForm.startAt = dateRange?.length > 1 ? dayjs(dateRange[0]).startOf("date").valueOf() : null;
        queryForm.endAt = dateRange?.length > 1 ? dayjs(dateRange[1]).endOf("date").valueOf() : null;
        console.log("query:", queryForm)
        loadUsers()
    }

    const onResetQuery = () => {
        doQuery({} as { userName: string, enabled: boolean, dateRange: number[] })
    }

    const onPageChange = (page: number, pageSize: number) => {
        queryForm.pageSize = pageSize
        queryForm.pageNum = page
        loadUsers()
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: User[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRowKeys(selectedRowKeys as string[])
        },
        getCheckboxProps: (record: User) => ({
            disabled: record.userName == "admin",
            name: record.userId,
        }),
    };
    const onSaveRes = () => {
        console.log("form Mode is", formMode)
        formRef.current?.validate().then((values) => {
            if (formMode == "new") {
                setDrawerLoading(true)
                userService.createUser(values).then(() => {
                    message.info("添加用户成功")
                    setIsDrawerOpen(false)
                    loadUsers()
                }).finally(() => {
                    setDrawerLoading(false)
                })
            } else {
                setDrawerLoading(true)
                values.userId = formState?.userId || ""
                userService.updateUser(values).then(() => {
                    message.info("修改用户成功")
                    setIsDrawerOpen(false)
                    loadUsers()
                }).finally(() => {
                    setDrawerLoading(false)
                })
            }
        }).catch(e => {
            console.log("validate error:", e)
        })

    }

    const onDeleteUsers = (userIds: string[]) => {
        setTableLoading(true)
        userService.deleteUsers(userIds).then(resp => {
            message.info(resp.msg)
            loadUsers()
        }).finally(() => setTableLoading(false))
    }


    const onSwitchStatus = (userId: string, checked: boolean) => {
        console.log("userId:", userId, ",checked:", checked)
        userService.switchUserStatus(userId, checked).then(() => {
            loadUsers()
        })
    }


    const onResetPwd = (user: User) => {
        setChangePasswordUser(user)
        setIsPasswdModalOpen(true)
    }
    const handleChangePasswdOk = () => {
        console.log("value:......")
        passwordForm.validateFields().then((values) => {
            console.log("value:", values)
            userService.changePassword(changePasswordUser?.userId as string, values.password).then(() => {
                setIsPasswdModalOpen(false)
                passwordForm.resetFields()
            })

        })


    }
    const handleChangePasswdCancel = () => {
        setChangePasswordUser(null)
        setIsPasswdModalOpen(false)
        passwordForm.resetFields()
    }

    return (
        <>
            <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                <Row>
                    <Form layout="inline"
                          onFinish={doQuery}
                          onReset={onResetQuery}
                    >
                        <Form.Item
                            label="用户名称"
                            name="userName">
                            <Input placeholder="用户名称" allowClear/>
                        </Form.Item>
                        <Form.Item
                            label="状态"
                            style={{width: 110}}
                            name="enabled">
                            <Select>
                                <Option value={true} key={1}>正常</Option>
                                <Option value={false} key={2}>停用</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="创建时间"
                            name="dateRange">
                            <DatePicker.RangePicker/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>查询</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="reset" icon={<RedoOutlined/>}>重置</Button>
                        </Form.Item>
                    </Form>
                </Row>
                <Row>
                    <Space>
                        <Button type="primary" onClick={() => openDrawer("new", "")}
                                icon={<PlusOutlined/>}>新增</Button>
                        <Popconfirm
                            placement="top"
                            title="确认删除"
                            disabled={selectedRowKeys.length <= 0}
                            description={"确定要删除" + selectedRowKeys.length + "个用户吗？"}
                            onConfirm={() => onDeleteUsers(selectedRowKeys)}
                            okText="是"
                            cancelText="否"
                        >
                            <Button type="primary" danger icon={<MinusOutlined/>}

                                    disabled={selectedRowKeys.length <= 0}>删除</Button>
                        </Popconfirm>
                    </Space>
                </Row>
                <Row>
                    <Table
                        style={{width: "100%"}}
                        scroll={{x: 1000}}
                        rowKey="userId"
                        size="middle"
                        tableLayout="fixed"
                        loading={tableLoading}
                        dataSource={dataSource}
                        pagination={false}
                        rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }}>

                        <Column title="序号" dataIndex="userId" key="userId" align="center" width={100} fixed="left"
                                render={(_, __, index: number) => (
                                    <>
                                        <span>{index + 1}</span>
                                    </>
                                )}/>
                        <Column title="用户名称" dataIndex="userName" key="userName" align="center" fixed="left"/>
                        <Column title="用户昵称" dataIndex="nickName" key="nickName" align="center"/>
                        <Column title="角色"
                                width={150}
                                dataIndex="roles"
                                key="roles"
                                align="center"
                                render={(roles: Role[], user: User) => {

                                    if (user.userName == "admin") {
                                        return <Tag color="red">超级管理员</Tag>
                                    } else {
                                        return (
                                            <>
                                                {roles?.map((role) => (
                                                    <Tag color="blue" key={role.authCode}> {role.roleName}</Tag>
                                                ))}
                                            </>
                                        )
                                    }
                                }}
                        />
                        <Column title="状态" dataIndex="enabled" key="enabled"
                                align="center" width={80}
                                render={(val, user: User) => {
                                    if (user.userName == "admin") {
                                        return <Tag color="green">正常</Tag>

                                    } else {
                                        return (
                                            <Switch defaultChecked={val}
                                                    onChange={(checked) => onSwitchStatus(user.userId, checked)}/>
                                        )
                                    }
                                }}
                        />
                        <Column title="最后登录时间" dataIndex="lastLoginAt" key="lastLoginAt" align="center"
                                width={150}/>
                        <Column title="创建时间" dataIndex="createdAt" key="createdAt" align="center"/>
                        <Column
                            title="操作"
                            fixed="right"
                            align="center" width={120}
                            key="action"
                            render={(_: string, user: User) => {
                                if (user.userName == "admin") {
                                    return
                                } else {
                                    return (
                                        <Space size="middle">
                                            <a key="edit" title="编辑用户"
                                               onClick={() => openDrawer("edit", user.userId)}><FormOutlined/></a>
                                            <Popconfirm
                                                placement="top"
                                                title="确认删除"
                                                description={"确定要删除用户【" + user.nickName + "】吗？"}
                                                onConfirm={() => onDeleteUsers([user.userId as string])}
                                                okText="是"
                                                cancelText="否"
                                            >
                                                <a title="删除用户"><DeleteOutlined/></a>
                                            </Popconfirm>
                                            <a title="重置密码" onClick={() => {
                                                onResetPwd(user)
                                            }}><KeyOutlined/></a>
                                        </Space>
                                    )
                                }
                            }}
                        />
                    </Table>
                </Row>
                <Row style={{justifyContent: "flex-end"}}>
                    <Pagination
                        showSizeChanger
                        defaultPageSize={10}
                        current={currentPage}
                        onChange={onPageChange}
                        showTotal={(total, range) => `第${range[0]}-${range[1]}条,共${total} 条记录`}
                        pageSizeOptions={[5, 10, 20, 50]}
                        total={totalUsers}/>
                </Row>
            </Space>
            <Drawer
                title={drawerTitle}
                width={720}
                onClose={onDrawerClose}
                open={isDrawerOpen}
                bodyStyle={{paddingBottom: 80}}
                extra={
                    <Space>
                        <Button onClick={onDrawerClose}>取消</Button>
                        <Button onClick={onSaveRes} type="primary">
                            提交
                        </Button>
                    </Space>
                }
            >
                <UserForm formState={formState} ref={formRef} loading={drawerLoading} mode={formMode}/>
            </Drawer>
            <Modal title="修改密码" open={isPasswdModalOpen} onOk={handleChangePasswdOk}
                   onCancel={handleChangePasswdCancel}>
                <Form form={passwordForm}>
                    <Form.Item label="新密码" name="password" rules={[{required: true, message: '新密码不能为空'}]}>
                        <Input.Password/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default UserManagement