import {
    Button,
    Col,
    Drawer,
    Form,
    Input, message,
    Pagination,
    Popconfirm,
    Row,
    Space,
    Table
} from "antd";
import {
    DeleteOutlined,
    FormOutlined,
    MinusOutlined,
    PlusOutlined,
    RedoOutlined,
    SearchOutlined,
    BarsOutlined,
} from "@ant-design/icons";


import React, {useEffect, useState} from "react";
import SysParamForm from "@/views/system/components/SysParamForm.tsx";
import {SysParam, SysParamQueryForm} from "@/models/sys-param-model.ts";
import * as paramService from "@/service/sys-param-service.ts";
import KDateRangePicker from "@/components/KDateRangePicker.tsx";
import ParamItemManagement from "@/views/system/components/ParamItemManagement.tsx";



const {Column} = Table
interface FormRef {
    validate: () => Promise<SysParam>
    getData: () => SysParam
}
const SysParamManagement = () => {

    const [drawerOption, setDrawerOption] = useState({
        title: "添加参数",
        open: false,
        loading: false,

    })
    const [itemDrawerOption,setItemDrawerOption] = useState({
        title:"参数条目",
        open:false,
        paramId:"",
    })
    const [formMode, setFormMode] = useState<"new"|"edit">("new")
    const formRef = React.createRef<FormRef>()
    const [formData,setFormData] = useState<SysParam>({})
    const [tableOption, setTableOption] = useState({
        total: 0,
        currentPage: 1,
        selectedRowKeys: [] as string[],
        datasource: [] as SysParam[],
        loading: false,

    })

    let queryForm:SysParamQueryForm={
        pageNum: 1,
        pageSize: 10,
    }

    const onDrawerClose = () => {
        setDrawerOption({...drawerOption, open: false})
    }
    const openDrawer = (mode: "new"|"edit", paramId: string,paramName?:string) => {
        setFormMode(mode)
        if (mode == "edit") {
            const title = paramName?" - "+paramName:""
            setDrawerOption({...drawerOption,title:"修改参数"+title,open: true,loading: true})
            paramService.getParam(paramId).then(resp => {
                console.log("resp:", resp)
                if (resp.data) {
                    setFormData(resp.data)
                    setDrawerOption({...drawerOption,loading: false,open: true})
                }
            })//.catch(() => setDrawerOption({...drawerOption,loading:false}))
        } else {
            setFormData({})
            setDrawerOption({...drawerOption,title: "添加参数", open: true})
        }
    }


    const onSaveParams = () => {

        formRef.current?.validate().then((values) => {
            console.log("mode",formMode,values)
            if (formMode == "new") {
                setDrawerOption({...drawerOption, open: true})
                paramService.createParam(values).then(() => {
                    message.info("添加参数成功")
                    setDrawerOption({...drawerOption, open: false})
                    loadParams()
                }).finally(() => {
                    // setDrawerOption({...drawerOption, open: false})
                })
            } else {
                setDrawerOption({...drawerOption, open: true})
                values.paramId = formData?.paramId || ""
                paramService.updateParam(values).then(() => {
                    message.info("修改参数信息成功")
                    setDrawerOption({...drawerOption, open: false})
                    loadParams()
                }).catch(() => {
                    // setDrawerOption({...drawerOption, open: false})
                })
            }
        }).catch(e => {
            console.log("validate error:", e)
        })


    }

    const doQuery = (values:SysParamQueryForm) => {
        queryForm={...queryForm, ...values, pageNum: 1}
        loadParams()
    }

    const onResetQuery = () => {
        doQuery({} as SysParamQueryForm)
    }

    const onDeleteParams = (paramIds: string[]) => {
        setTableOption({...tableOption, loading: true})
        paramService.deleteParams(paramIds).then(resp => {
            message.info(resp.msg)
            loadParams()
        }).finally(() => setTableOption({...tableOption, loading: false}))
    }

    const loadParams = () => {
        setTableOption({...tableOption,loading: true})
        paramService.queryParams(queryForm).then((res) => {
            setTableOption({...tableOption, datasource: res.data,total: res.total||0,currentPage: res.pageNum||1,loading: false})
        }).catch(()=>setTableOption({...tableOption,loading: false}))
    }

    const rowSelection = {
        selectedRowKeys: tableOption.selectedRowKeys, //加上这才会清除选中缓存
        onChange: (selectedRowKeys: React.Key[]) => {
            setTableOption({...tableOption, selectedRowKeys: selectedRowKeys as string[]})
        },
        getCheckboxProps: (record: SysParam) => ({
            name: record.paramId,
        }),
    };

    const onPageChange = (page: number, pageSize: number) => {
        queryForm={...queryForm, pageSize: pageSize, pageNum: page}
        loadParams()
    }

    const openItemDrawer=(paramId:string,paramName?:string)=>{

       setItemDrawerOption({...itemDrawerOption,paramId: paramId,open: true,title:"参数条目 -" +paramName})
    }
    const onItemDrawerClose=()=>{
        setItemDrawerOption({...itemDrawerOption,paramId: "",open: false})
    }
    useEffect(() => {
        loadParams()
    }, []);

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
                                <Col span={6}>
                                    <Form.Item
                                        name="paramName"
                                        label="参数名称"
                                    >
                                        <Input placeholder="参数名称" allowClear/>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="paramKey"
                                        label="参数主键">
                                        <Input placeholder="参数主键" allowClear/>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="createdAtRange"
                                        label="创建时间">
                                        <KDateRangePicker/>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Space>
                                    <Form.Item>
                                        <Button
                                            htmlType="submit"
                                            type="primary"
                                            icon={<SearchOutlined/>}>搜索</Button>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            htmlType="reset"
                                            type="default"
                                            icon={<RedoOutlined/>}>重置</Button>
                                    </Form.Item>
                                    </Space>
                                </Col>
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
                            disabled={tableOption.selectedRowKeys.length <= 0}
                            description={"确定要删除" + tableOption.selectedRowKeys.length + "个角色吗？"}
                            onConfirm={() => onDeleteParams(tableOption.selectedRowKeys)}
                            okText="是"
                            cancelText="否"
                        >
                            <Button type="primary" danger icon={<MinusOutlined/>}

                                    disabled={tableOption.selectedRowKeys.length <= 0}>删除</Button>
                        </Popconfirm>
                    </Space>
                </Row>
                <Row>
                    <Table
                        rowKey="paramId"
                        size="middle"
                        tableLayout="fixed"
                        dataSource={tableOption.datasource}
                        loading={tableOption.loading}
                        pagination={false}
                        rowSelection={{
                            type: "checkbox",
                            ...rowSelection,
                        }}>
                        <Column title="序号" dataIndex="paramId" key="paramId" width={80} align="center"
                                render={(_, __: never, index: number,) => (
                                    <>
                                        <span>{index + 1}</span>
                                    </>
                                )}/>
                        <Column title="参数名称" dataIndex="paramName" key="paramName" align="center"/>
                        <Column title="参数键" dataIndex="paramKey" key="paramKey" align="center"/>
                        <Column title="创建时间" dataIndex="createdAt" key="createdAt" align="center"/>

                        <Column
                            title="操作"
                            key="action"
                            align="center"
                            width={120}
                            render={(_: string, sysParam: SysParam) => (
                                <Space size="middle">
                                    <a onClick={() => openDrawer("edit", sysParam.paramId as string,sysParam.paramName)}><FormOutlined
                                        title="编辑"/></a>
                                    <a onClick={() => openItemDrawer(sysParam.paramId as string,sysParam.paramName)}><BarsOutlined
                                        title="编辑条目"/></a>
                                    <Popconfirm
                                        placement="top"
                                        title="确认删除"
                                        description={"确定要删除【" + sysParam.paramName + "】参数吗？"}
                                        onConfirm={() => onDeleteParams([sysParam.paramId as string])}
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
                <Row style={{justifyContent: "flex-end"}}>
                    <Pagination
                        showSizeChanger
                        defaultPageSize={10}
                        current={tableOption.currentPage}
                        onChange={onPageChange}
                        showTotal={(total, range) => `第${range[0]}-${range[1]}条,共${total} 条记录`}
                        pageSizeOptions={[5, 10, 20, 50]}
                        total={tableOption.total}/>
                </Row>
            </Space>
            <Drawer
                title={drawerOption.title}
                width={"60%"}
                onClose={onDrawerClose}
                open={drawerOption.open}
                bodyStyle={{paddingBottom: 80}}
                extra={
                    <Space>
                        <Button onClick={onDrawerClose}>取消</Button>
                        <Button onClick={onSaveParams} type="primary">保存</Button>
                    </Space>
                }
            >

                <SysParamForm ref={formRef} formData={formData} loading={drawerOption.loading} mode={formMode}/>
            </Drawer>

            <Drawer
                title={itemDrawerOption.title}
                width={"60%"}
                onClose={onItemDrawerClose}
                open={itemDrawerOption.open}
                bodyStyle={{paddingBottom: 80}}
                extra={
                    <Space>
                        <Button onClick={onItemDrawerClose} type="primary">完成</Button>
                    </Space>
                }
            >

                <ParamItemManagement paramId={itemDrawerOption.paramId}/>
            </Drawer>
        </>
    )
}

export default SysParamManagement