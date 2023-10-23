import {Button,  Form, Input, message, Pagination, Popconfirm, Row, Select, Space, Table, Tag} from "antd";
import {Role, RoleUserQueryForm, User} from "@/models/sys-model.ts";
import {
    CloseSquareOutlined,
    UsergroupAddOutlined,
    UserDeleteOutlined,
    UsergroupDeleteOutlined, SearchOutlined, RedoOutlined,
} from "@ant-design/icons";
import React, {useEffect, useState} from "react";

import * as roleService from "@/service/role-service.ts";
import {Link, useParams} from "react-router-dom";
import RoleUserSelect from "@/views/system/components/RoleUserSelect.tsx";

const {Column} = Table
const {Option} = Select

const RoleUserManagement = () => {

    const [tableLoading, setTableLoading] = useState(false)
    const [dataSource, setDataSource] = useState<User[]>([])

    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState(0)
    const [totalUsers, setTotalUsers] = useState(0)
    const [currentRole, setCurrentRole] = useState<Role>()
    const [isDrawerOpen,setIsDrawerOpen] = useState(false)
    //取消授权
    const {roleId} = useParams()

    useEffect(() => {
        if(roleId != undefined){
            roleService.getRole(roleId).then(resp=>{
                setCurrentRole(resp.data)
                if(resp.data.roleId){
                    queryForm.roleId = resp.data.roleId
                    loadUsers()
                }else{
                    message.error("系统错误，请联系管理员")
                }

            })
        }else{
            message.error("系统错误，请联系管理员")
        }
    }, []);
    const onRevoke = (userIds: string[]) => {
           if (userIds.length<=0){
               return
           }
           roleService.deleteUsersOfRole(roleId as string,userIds).then(()=>{
               message.info("删除成功")
               loadUsers()
           })
    }
    const queryForm: RoleUserQueryForm = {
        isBelongToRole:true,
        roleId: roleId,
        pageNum: 1,
        pageSize: 10,
    }
    const loadUsers = () => {
        setTableLoading(true)
        roleService.queryUserOfRole(queryForm).then(resp => {
            console.log("data", resp)
            if (resp.data) {
                setDataSource(resp.data)
                setCurrentPage(resp.pageNum || 1)
                setTotalUsers(resp.total || 0)
                setSelectedRowKeys([])
            }

        }).finally(() => setTableLoading(false))
    }
    const doQuery = (values: { userName: string, enabled: boolean }) => {
        queryForm.pageNum = 1
        queryForm.userName = values.userName;
        queryForm.enabled = values.enabled;
        loadUsers()
    }
    const onResetQuery = () => {
        doQuery({} as { userName: string, enabled: boolean })
    }
    const onPageChange = (page: number, pageSize: number) => {
        queryForm.pageNum = page
        queryForm.pageSize = pageSize
        loadUsers()
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: User[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRowKeys(selectedRowKeys as string[])
        },
        getCheckboxProps: (record: User) => ({
            name: record.userId,
        }),
    };

    const onCloseDrawer=()=>{
        setIsDrawerOpen(false)
    }
    const onSubmitAddUser=(userIds:string[])=>{
        if(userIds.length<=0 ){
            return
        }

        roleService.createUsersOfRole(roleId as string,userIds).then((resp)=>{
            console.log(resp)
            message.info("添加用户成功")
            setIsDrawerOpen(false)

            loadUsers()
        })
    }
    return (
        <>
            <Space direction="vertical">
                <Row>
                    <Space><span style={{color:"grey",fontSize:14}}>当前角色:</span><span style={{color:"black",fontSize:18}}>{currentRole?.roleName}</span><Button type="dashed"><Link to="/role"><CloseSquareOutlined/>关闭</Link></Button></Space>
                </Row>
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
                        <Button type="primary" onClick={()=>setIsDrawerOpen(true)}><UsergroupAddOutlined/>添加用户</Button>

                        <Popconfirm
                            placement="top"
                            title="确认删除"
                            disabled={selectedRowKeys.length <= 0}
                            description={"确定要删除" + selectedRowKeys.length + "个用户吗？"}
                            onConfirm={() => onRevoke(selectedRowKeys)}
                            okText="是"
                            cancelText="否"
                        >
                            <Button type="primary" danger
                                    disabled={selectedRowKeys.length<=0}><UsergroupDeleteOutlined/>批量取消授权</Button>
                        </Popconfirm>
                    </Space>
                </Row>
                <Row>
                    <Table
                        rowKey="userId"
                        size="middle"
                        tableLayout="fixed"
                        loading={tableLoading}
                        dataSource={dataSource}
                        pagination={false}
                        rowSelection={{
                            type: "checkbox",
                            ...rowSelection,
                        }}>

                        <Column title="序号" dataIndex="userId" key="userId" align="center"  width={100}
                                render={(_, __, index: number) => (
                                    <>
                                        <span>{index + 1}</span>
                                    </>
                                )}/>
                        <Column title="用户名称" dataIndex="userName" key="userName" align="center" />
                        <Column title="用户昵称" dataIndex="nickName" key="nickName" align="center" />
                        <Column title="状态" dataIndex="enabled" key="enabled"
                                align="center" width={80}
                                render={(enabled: boolean) => (
                                    <>
                                        <Tag color={enabled ? "green" : "red"}
                                             key="status">{enabled ? "正常" : "停用"}</Tag>
                                    </>
                                )}
                        />
                        <Column title="创建时间" dataIndex="createdAt" key="createdAt" align="center"/>
                        <Column
                            title="操作"
                            fixed="right"
                            align="center" width={120}
                            key="action"
                            render={(_: string, user: User) => (
                                <Space size="middle">
                                    <Popconfirm
                                        placement="top"
                                        title="确认删除"
                                        description={"确定要取消授予用户【" + user.nickName + "】角色吗？"}
                                        onConfirm={() => onRevoke([user.userId as string])}
                                        okText="是"
                                        cancelText="否"
                                    >
                                        <a title="取消授权"><UserDeleteOutlined/>取消授权</a>
                                    </Popconfirm>
                                </Space>
                            )}
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
            <RoleUserSelect roleId={roleId} open={isDrawerOpen} title="选择用户" onSubmit={onSubmitAddUser} onCancel={onCloseDrawer}/>
        </>
    )
}


export default RoleUserManagement

