import {Button, Drawer, Form, Input, message, Popconfirm, Row, Select, Space, Table, Tag} from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    NodeCollapseOutlined,
    RedoOutlined,
    DeleteOutlined,
    FormOutlined,
FileAddOutlined,
} from "@ant-design/icons";
import React, {useEffect, useState} from "react";


import ResForm from "./components/ResForm.tsx";
import {Res, ResQueryForm, ResType} from "@/models/sys-model.ts";
import {IconComponent} from "./components/IconComponent.tsx";

import * as resService from "@/service/res-service.ts"
import {observer} from "mobx-react-lite";

const {Column} = Table;
const {Option} = Select
const initialFormState: Res = {
    resId: "",
    resName: "",
    enabled: true,
    visible:true,
    resType: ResType.Catalog,
    icon: "",
    parentId: "root",
    sort: 1,
    url: "",
    component: "",
    authCode: "",
    urlParams: "",
}
type FormMode = "new" | "edit"

interface FormRef {
    validate: () => Promise<Res>
    getData: () => Res[]
}

function getAllIds(res :Res[]):string[]{
    const arr:string[] = []
    res.forEach(res=>{
        arr.push(res.resId)
        if (res.children) {
           const c= getAllIds(res.children);
           arr.push(...c)
        }
    })
    return arr
}

const ResManagement = () => {


    useEffect(() => {
        loadRes()

    }, [])

    const [pageLoading, setPageLoading] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerTitle, setDrawerTitle] = useState("资源信息");
    const [drawerLoading, setDrawerLoading] = useState(false)
    const [dataSource, setDataSource] = useState<Res[]>([])

    const [formState, setFormState] = useState<Res>(initialFormState)
    const [formMode,setFormMode] = useState<FormMode>("new")
    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

    const handleExpandAllRows = () => {
        if (expandedRowKeys.length >0){
            setExpandedRowKeys([])
        }else {
            setExpandedRowKeys(getAllIds(dataSource));
        }

    };

    const openDrawer = (mode: FormMode, resId: string) => {
        setFormMode(mode)
        console.log("open drawer,mode",formMode)
        if (mode == "edit") {
            setDrawerTitle("修改菜单信息")
            setIsDrawerOpen(true)
            setDrawerLoading(true)
            resService.getRes(resId).then(resp => {
                console.log("resp:", resp)
                if (resp.data) {
                    setFormState(resp.data)
                }
            }).finally(() => setDrawerLoading(false))
        } else {
            setDrawerTitle("创建菜单信息")
            setFormState({...initialFormState,parentId:resId})
            setIsDrawerOpen(true)

        }

    }


    const onDrawerClose = () => {
        setIsDrawerOpen(false)
    }
    const queryForm: ResQueryForm = {
        resType: null,
        resName: null,
        sorts:["sort.asc"]
    }
    const loadRes = () => {
        setPageLoading(true)
        resService.queryRes(queryForm).then(resp => {
            console.log("data", resp)
            if (resp.data) {
                setDataSource(resp.data)
                console.log("expandedRowKeys",expandedRowKeys)


            }

        }).finally(() => {
            setPageLoading(false)
        })
    }

    useEffect(() => {
        if(expandedRowKeys.length==0){
            setExpandedRowKeys(getAllIds(dataSource));
        }
    }, [dataSource]);
    const doQuery=(values:ResQueryForm)=>{
        console.log("query:",values)
        queryForm.resName= values.resName
        queryForm.resType=values.resType
        loadRes()
    }


    const onSaveRes = () => {
        console.log("form Mode is",formMode)
        formRef.current?.validate().then((values) => {

            if (formMode == "new") {
                setDrawerLoading(true)
                resService.createRes(values).then(() => {
                    message.info("创建菜单成功")
                    setIsDrawerOpen(false)
                    loadRes()
                }).finally(() => {
                    setDrawerLoading(false)
                })
            } else {
                setDrawerLoading(true)
                values.resId =formState.resId
                resService.updateRes(values).then(() => {
                    message.info("修改菜单成功")
                    setIsDrawerOpen(false)
                    loadRes()
                }).finally(() => {
                    setDrawerLoading(false)
                })
            }
        }).catch(e => {
            console.log("validate error:", e)
        })

    }

    const onDeleteRes = (resIds: string[]) => {
        setPageLoading(true)
        resService.deleteRes(resIds).then(resp => {
            message.info(resp.msg)
            loadRes()
        }).finally(() => setPageLoading(false))
    }


    const formRef = React.createRef<FormRef>()
    return (
        <>
            <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                <Row>
                    <Space>
                        <Form
                        layout="inline"
                        onFinish={doQuery}
                        >
                            <Form.Item
                                label="菜单类型"
                                name="resType">
                                <Select allowClear style={{width:80}} notFoundContent="全部">
                                    <Option value={ResType.Catalog}>目录</Option>
                                    <Option value={ResType.Menu}>菜单</Option>
                                    <Option value={ResType.Button}>按钮</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="菜单名称"
                                name="resName">
                                <Input placeholder="菜单名称"  allowClear/>
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

                        </Form>
                        <Button type="primary" onClick={() => openDrawer("new", "root")}
                                icon={<PlusOutlined/>}>新增</Button>
                        <Button type="primary" onClick={handleExpandAllRows}
                                icon={<NodeCollapseOutlined/>}>展开/折叠</Button>

                    </Space>
                </Row>
                <Row>
                    <Table
                        size="middle"
                        rowKey="resId"
                        scroll={{y:500}}
                        pagination={false}
                        tableLayout="fixed"
                        indentSize={30}
                        loading={pageLoading}
                        dataSource={dataSource}
                        expandable={{
                            expandedRowKeys:expandedRowKeys,
                            onExpand:(expanded,r)=>{
                                console.log("onExpand....",expanded,r.resId)
                                if(expanded){
                                    const exp = [...expandedRowKeys,r.resId]
                                    setExpandedRowKeys(exp)
                                }else{
                                    setExpandedRowKeys( expandedRowKeys.filter(e=>e!=r.resId))

                                }

                            },


                        }}

                    >
                        <Column title="菜单名称" dataIndex="resName" width={250} key="resName" fixed="left"/>
                        <Column title="图标" dataIndex="icon" key="icon" width={80} align="center"
                                render={(val) => (
                                    <>
                                        <IconComponent iconName={val}/>
                                    </>
                                )}
                        />
                        <Column title="排序" dataIndex="sort" key="sort" width={80} align="center"/>
                        <Column title="权限标识" dataIndex="authCode" key="authCode" align="center"/>
                        <Column title="路由地址" dataIndex="url" key="url"/>
                        <Column title="状态" dataIndex="enabled" key="enabled" align="center" width={100}
                                render={(enabled) => (
                                    <>
                                        <Tag color={enabled ? "green" : "red"}
                                             key="status">{enabled ? "正常" : "停用"}</Tag>
                                    </>
                                )}
                        />
                        <Column title="创建时间" dataIndex="createdAt" key="createdAt"/>
                        <Column
                            fixed="right"
                            title="操作"
                            key="action"
                            render={(_: string, res: Res) => (
                                <Space size="middle">
                                    <a onClick={() => openDrawer("edit", res.resId)}><FormOutlined title="编辑"/></a>
                                    <a onClick={() => openDrawer("new", res.resId)}><FileAddOutlined title="新增"/></a>
                                    <Popconfirm
                                        placement="top"
                                        title="确认删除"
                                        description={"确定要删除【" + res.resName + "】菜单吗？"}
                                        onConfirm={() => onDeleteRes([res.resId])}
                                        okText="是"
                                        cancelText="否"
                                    >
                                        <a><DeleteOutlined title="删除"/></a>
                                    </Popconfirm>
                                </Space>
                            )}
                        />
                    </Table>
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
                        <Button onClick={onSaveRes} type="primary">保存</Button>
                    </Space>
                }
            >
                <ResForm
                    ref={formRef}
                    formState={formState}
                    resList={dataSource}
                    loading={drawerLoading}
                />
            </Drawer>
        </>
    )
}

export default observer(ResManagement)