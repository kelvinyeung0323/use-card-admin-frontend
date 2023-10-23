import {
    Button,
    Col,
    DatePicker,
    Drawer,
    Form,
    Input,
    message, Pagination,
    Popconfirm,
    Row,
    Select,
    Space,
    Switch,
    Table,
} from "antd";
import {
    PlusOutlined,
    MinusOutlined,
    SearchOutlined,
    RedoOutlined,
    TeamOutlined,
    DeleteOutlined, FormOutlined
} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import { Role, RoleQueryForm} from "@/models/sys-model.ts";
import RoleForm from "./components/RoleForm.tsx";
import * as roleService from "@/service/role-service.ts"
import dayjs from "dayjs";
import {Link} from "react-router-dom";

const {Column} = Table;
const {Option} = Select
type FormMode = "new" | "edit"


interface HalfChecked{
    checked:string[],
    halfChecked:string[]
}
interface RoleFormReturn {
    roleId?:string,
    roleName:string,
    authCode:string,
    enabled?:boolean,
    createdAt?:string,
    resIds:HalfChecked|string[] //因为当tree halfChecked 时返回的结构不是string列表
}
interface FormRef {
    validate: () => Promise<RoleFormReturn>
    getData: () => RoleFormReturn
}

const initialFormState: Role = {
    authCode: "", createdAt: "", enabled: true, roleId: "", roleName: "",resIds:[]
}

function RoleManagement() {


    const [tableLoading, setTableLoading] = useState(false)
    const [drawerLoading, setDrawerLoading] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerTitle, setDrawerTitle] = useState("创建角色");
    const [selectionType] = useState<'checkbox' | 'radio'>('checkbox');
    const [formMode, setFormMode] = useState<FormMode>("new")
    const [formState, setFormState] = useState<Role>(initialFormState)
    const [selectedRowKeys,setSelectedRowKeys] = useState<string[]>([])
    const [currentPage,setCurrentPage] =useState<number>(1)
    const [totalRoles,setTotalRoles] = useState<number>(0)
    const queryForm: RoleQueryForm = {
        pageNum:1,
        pageSize:10,
        roleName: null,
        authCode: null,
        enabled: null,
        startAt: null,
        endAt: null,
        sort: null,
    }
    const formRef = React.createRef<FormRef>()

    const [dataSource, setDataSource] = useState<Role[]>([])

    const rowSelection = {
        selectedRowKeys, //加上这才会清除选中缓存
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(selectedRowKeys as string[])
        },
        getCheckboxProps: (record: Role) => ({
            name: record.roleId,
        }),
    };

    const openDrawer = (mode: FormMode, roleId: string) => {
        setFormMode(mode)
        if (mode == "edit") {
            setDrawerTitle("修改角色")
            setIsDrawerOpen(true)
            setDrawerLoading(true)
            roleService.getRole(roleId).then(resp => {
                if (resp.data) {
                    setFormState(resp.data)
                }
            }).finally(() => setDrawerLoading(false))
        } else {
            setDrawerTitle("创建角色")
            setFormState({...initialFormState})
            setIsDrawerOpen(true)

        }

    }


    const onDrawerClose = () => {
        setIsDrawerOpen(false)
    }


    const loadRoles = () => {
        setTableLoading(true)
        roleService.queryRole(queryForm).then((resp) => {
            setDataSource(resp.data)
            setTotalRoles(resp.total||0)
            setCurrentPage(resp.pageNum as number)
        }).finally(() => {
            setTableLoading(false)
        })
    }

    const doQuery = (values:{roleName:string,authCode:string,enabled:boolean,dateRange:number[]}) => {
        queryForm.roleName = values.roleName
        queryForm.authCode = values.authCode
        queryForm.enabled = values.enabled
        const dateRange = values.dateRange;
        queryForm.startAt = dateRange?.length > 1 ? dayjs(dateRange[0]).startOf("date").valueOf() : null;
        queryForm.endAt = dateRange?.length > 1 ? dayjs(dateRange[1]).endOf("date").valueOf() : null;
        loadRoles()
    }

    const onResetQuery=()=>{
        doQuery({} as {roleName:string,authCode:string,enabled:boolean,dateRange:number[]})

    }
    const onSwitchStatus = (roleId: string, checked: boolean) => {
        setTableLoading(true)
        roleService.switchRoleStatus(roleId, checked).then(() => {
            loadRoles()
        }).finally(()=>setTableLoading(false))
    }
    const onSaveRole = () => {

        formRef.current?.validate().then((values) => {
            let resIds:string[];
            if(values.resIds instanceof Array){
                resIds = values.resIds
            }else{
                resIds = values.resIds.checked
            }
            const formValues = {...values,resIds:resIds}
            if (formMode == "new") {
                setDrawerLoading(true)
                roleService.createRole(formValues).then(() => {
                    message.info("创建角色成功")
                    setIsDrawerOpen(false)
                    loadRoles()
                }).finally(() => {
                    setDrawerLoading(false)
                })
            } else {
                setDrawerLoading(true)
                formValues.roleId = formState?.roleId

                roleService.updateRole(formValues).then(() => {
                    message.info("修改角色成功")
                    setIsDrawerOpen(false)
                    loadRoles()
                }).finally(() => {
                    setDrawerLoading(false)
                })
            }
        }).catch(e => {
            console.log("validate error:", e)
        })

    }

    const onDeleteRole = (roleIds: string[]) => {
        setTableLoading(true)
        roleService.deleteRole(roleIds).then(resp => {
            message.info(resp.msg)
            loadRoles()
        }).finally(() => setTableLoading(false))
    }

    useEffect(() => {
        loadRoles()
    }, []);



   const onPageChange =(page: number, pageSize: number)=>{
       queryForm.pageSize=pageSize
       queryForm.pageNum=page
       loadRoles()
   }
    return (
        <>
            <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                <Row>
                    <Space>
                        <Form
                         onFinish={doQuery}
                         onReset={onResetQuery}
                        >
                            <Row gutter={12}>
                               <Col span={8}>
                                   <Form.Item
                                       name="roleName"
                                       label="角色名称"
                                   >
                                       <Input placeholder="角色名称" allowClear/>
                                   </Form.Item>
                               </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="authCode"
                                        label="权限标识">
                                        <Input placeholder="权限标识" allowClear/>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="enabled"
                                        label="状态">
                                        <Select notFoundContent="全部"  allowClear>
                                            <Option value={true} key={1}>正常</Option>
                                            <Option value={false} key={2}>停用</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Space>

                                    <Form.Item
                                        name="dateRange"
                                        label="创建时间">
                                        <DatePicker.RangePicker/>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            htmlType="submit"
                                            type="primary"
                                            icon={<SearchOutlined />}>搜索</Button>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            htmlType="reset"
                                            type="default"
                                            icon={<RedoOutlined />}>重置</Button>
                                    </Form.Item>
                                </Space>
                            </Row>
                        </Form>


                    </Space>
                </Row>
                <Row>
                    <Space>
                        <Button type="primary" onClick={() => openDrawer("new", "")}
                                icon={<PlusOutlined/>}>新增</Button>
                        <Popconfirm
                            placement="top"
                            title="确认删除"
                            disabled={selectedRowKeys.length<=0}
                            description={"确定要删除" + selectedRowKeys.length + "个角色吗？"}
                            onConfirm={() => onDeleteRole(selectedRowKeys)}
                            okText="是"
                            cancelText="否"
                        >
                        <Button type="primary" danger icon={<MinusOutlined/>}

                        disabled={selectedRowKeys.length<=0}>删除</Button>
                        </Popconfirm>
                    </Space>
                </Row>
                <Row>
                    <Table
                        rowKey="roleId"
                        size="middle"
                        tableLayout="fixed"
                        dataSource={dataSource}
                        loading={tableLoading}
                        pagination={false}
                        rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }}>
                        <Column title="序号" dataIndex="roleId" key="roleId" width={80} align="center"
                                render={(_,__:never,index: number,) => (
                                    <>
                                        <span>{index + 1 }</span>
                                    </>
                                )}/>
                        <Column title="角色名称" dataIndex="roleName" key="roleName" align="center"/>
                        <Column title="权限标识" dataIndex="authCode" key="authCode" align="center"/>
                        <Column title="状态" dataIndex="enabled" key="enabled" align="center"

                                render={(val,role:Role) => (
                                    <Switch defaultChecked={val}   onChange={(checked) => onSwitchStatus(role.roleId as string, checked)}/>
                                )}
                        />
                        <Column title="创建时间" dataIndex="createdAt" key="createdAt" align="center"/>

                        <Column
                            title="操作"
                            key="action"
                            align="center"
                            width={120}
                            render={(_: string, role: Role) => (
                                <Space size="middle">
                                    <a onClick={() => openDrawer("edit",role.roleId as string)}><FormOutlined title="编辑"/></a>
                                    <Popconfirm
                                        placement="top"
                                        title="确认删除"
                                        description={"确定要删除【" + role.roleName + "】角色吗？"}
                                        onConfirm={() => onDeleteRole([role.roleId as string])}
                                        okText="是"
                                        cancelText="否"
                                    >
                                        <a><DeleteOutlined title="删除"/></a>
                                    </Popconfirm>
                                    <Link to={"/role/user/"+role.roleId}><TeamOutlined title="分配用户"/></Link>
                                </Space>
                            )}
                        />
                    </Table>

                </Row>
                <Row style={{justifyContent:"flex-end"}}>
                    <Pagination
                        showSizeChanger
                        defaultPageSize={10}
                        current={currentPage}
                        onChange={onPageChange}
                        showTotal={(total, range) => `第${range[0]}-${range[1]}条,共${total} 条记录`}
                        pageSizeOptions={[5,10,20,50]}
                        total={totalRoles} />
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
                        <Button onClick={onSaveRole} type="primary">保存</Button>
                    </Space>
                }
            >
                <RoleForm
                    ref={formRef}
                    formState={formState}
                    loading={drawerLoading}
                />
            </Drawer>
        </>
    )
}

export default RoleManagement