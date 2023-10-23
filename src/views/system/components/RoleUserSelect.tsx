import {
    Button,
    DatePicker,
    Drawer,
    Form,
    Input, message,
    Pagination,
    Row,
    Space,
    Table,
    Tag
} from "antd";
import {
    RedoOutlined,
    SearchOutlined
} from "@ant-design/icons";
import { RoleUserQueryForm, User} from "@/models/sys-model.ts";
import * as roleService from "@/service/role-service.ts";
import dayjs from "dayjs";
import React, {useEffect, useState} from "react";

const {Column} = Table

interface Props {
    roleId?: string
    title?: string
    onSubmit?: (keys:string[]) => void
    open?: boolean
    onCancel?: ()=>void
}

const RoleUserSelect = ({roleId,title, onSubmit,onCancel, open}: Props) => {

    const [tableLoading, setTableLoading] = useState(false)
    const [dataSource, setDataSource] = useState<User[]>()
    const [currentPage, setCurrentPage] = useState(0)
    const [totalUsers, setTotalUsers] = useState(0)
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
    const queryForm: RoleUserQueryForm = {
        isBelongToRole:false,
        roleId: roleId,
        pageNum: 1,
        pageSize: 10,
        userName: null,
        enabled: null,
    }
    useEffect(() => {
        if(open){
            loadUsers()
        }
    }, [open]);
    const loadUsers = () => {
        if(!queryForm.roleId){
            message.error("获取不到相关角色信息")
        }
        setTableLoading(true)
        roleService.queryUserOfRole(queryForm).then(resp => {
            console.log("data", resp)
            if (resp.data) {
                setDataSource(resp.data)
                setCurrentPage(resp.pageNum || 1)
                setTotalUsers(resp.total || 0)
            }

        }).finally(() => setTableLoading(false))
    }


    const doQuery = (values: { userName: string, dateRange: number[] }) => {
        queryForm.pageNum = 1
        queryForm.userName = values.userName;
        const dateRange = values.dateRange;
        queryForm.startAt = dateRange?.length > 1 ? dayjs(dateRange[0]).startOf("date").valueOf() : undefined;
        queryForm.endAt = dateRange?.length > 1 ? dayjs(dateRange[1]).endOf("date").valueOf() : undefined;
        console.log("query:", queryForm)
        loadUsers()
    }

    const onResetQuery = () => {
        doQuery({} as { userName: string, dateRange: number[] })
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
        // getCheckboxProps: (record: User) => ({
        //     name: record.userId,
        // }),
    };


    const onConfirm = () => {
        if (onSubmit) {
            onSubmit(selectedRowKeys)
        }
    }

    return (
        <>
            <Drawer title={title} open={open}
                    width={820}
                    bodyStyle={{paddingBottom: 80}}
                    onClose={onCancel}
                    extra={
                        <Space>
                            <Button onClick={onCancel}>取消</Button>
                            <Button onClick={onConfirm} type="primary" disabled={selectedRowKeys.length <= 0}>
                                添加
                            </Button>
                        </Space>
                    }
            >
                <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                    <Row>
                        <Form layout="inline"
                              onFinish={doQuery}
                              onReset={onResetQuery}
                        >
                            <Space direction="vertical">
                                <Row>
                                    <Space>
                                        <Form.Item
                                            label="用户名称"
                                            name="userName">
                                            <Input placeholder="用户名称" allowClear/>
                                        </Form.Item>
                                        <Form.Item
                                            label="创建时间"
                                            name="dateRange">
                                            <DatePicker.RangePicker/>
                                        </Form.Item>
                                    </Space>
                                </Row>
                                <Row>
                                    <Space>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit"
                                                    icon={<SearchOutlined/>}>查询</Button>
                                        </Form.Item>
                                        <Form.Item>
                                            <Button htmlType="reset" icon={<RedoOutlined/>}>重置</Button>
                                        </Form.Item>
                                    </Space>
                                </Row>
                            </Space>
                        </Form>
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

                            <Column title="序号" dataIndex="userId" key="userId" align="center" width={100}
                                    render={(_, __, index: number) => (
                                        <>
                                            <span>{index + 1}</span>
                                        </>
                                    )}/>
                            <Column title="用户名称" dataIndex="userName" key="userName" align="center"/>
                            <Column title="用户昵称" dataIndex="nickName" key="nickName" align="center"/>
                            <Column title="状态" dataIndex="enabled" key="enabled"
                                    align="center" width={80}
                                    render={(enabled) => (
                                        <>
                                            <Tag color={enabled ? "green" : "red"}
                                                 key="status">{enabled ? "正常" : "停用"}</Tag>
                                        </>
                                    )}
                            />
                            <Column title="创建时间" dataIndex="createdAt" key="createdAt" align="center" width={150}/>
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

            </Drawer>
        </>
    )
}

export default RoleUserSelect