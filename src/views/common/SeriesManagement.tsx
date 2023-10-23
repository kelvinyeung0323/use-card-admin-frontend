import {
    Button,
    Col,
    Drawer,
    Form, Image,
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
} from "@ant-design/icons";

import React, {useEffect, useState} from "react";
import * as seriesService from "@/service/item-common-service.ts";
import KDateRangePicker from "@/components/KDateRangePicker.tsx";
import {Series, SeriesQueryForm} from "@/models/item-common-model.ts";

import SeriesForm from "@/views/common/SeriesForm.tsx";




const {Column} = Table
interface FormRef {
    validate: () => Promise<Series>
    getData: () => Series
}
const SeriesManagement = () => {

    const [drawerOption, setDrawerOption] = useState({
        title: "添加品牌",
        open: false,
        loading: false,

    })
    const [formMode, setFormMode] = useState<"new"|"edit">("new")
    const formRef = React.createRef<FormRef>()
    const [formData,setFormData] = useState<Series>({})
    const [tableOption, setTableOption] = useState({
        total: 0,
        currentPage: 1,
        selectedRowKeys: [] as number[],
        datasource: [] as Series[],
        loading: false,

    })

    let queryForm:SeriesQueryForm={
        pageNum: 1,
        pageSize: 10,
    }

    const onDrawerClose = () => {
        setDrawerOption({...drawerOption, open: false})
    }
    const openDrawer = (mode: "new"|"edit", seriesId: number) => {
        setFormMode(mode)
        if (mode == "edit") {
            setDrawerOption({...drawerOption,title:"修改品牌",open: true,loading: true})
            seriesService.getSeries(seriesId).then(resp => {
                console.log("resp:", resp)
                if (resp.data) {
                    setFormData(resp.data)
                    setDrawerOption({...drawerOption,loading: false,open: true})
                }
            })//.catch(() => setDrawerOption({...drawerOption,loading:false}))
        } else {
            setFormData({})
            setDrawerOption({...drawerOption,title: "添加品牌", open: true})
        }
    }


    const onSaveSeries = () => {

        formRef.current?.validate().then((values) => {

            if (formMode == "new") {
                setDrawerOption({...drawerOption, open: true})
                seriesService.createSeries(values).then(() => {
                    message.info("添加品成功")
                    setDrawerOption({...drawerOption, open: false})
                    loadSeries()
                }).finally(() => {
                    // setDrawerOption({...drawerOption, open: false})
                })
            } else {
                setDrawerOption({...drawerOption, open: true})
                values.seriesId = formData?.seriesId || 0
                seriesService.updateSeries(values).then(() => {
                    message.info("修改品成功")
                    setDrawerOption({...drawerOption, open: false})
                    loadSeries()
                }).catch(() => {
                    // setDrawerOption({...drawerOption, open: false})
                })
            }
        }).catch(e => {
            console.log("validate error:", e)
        })


    }

    const doQuery = (values:SeriesQueryForm) => {
        queryForm={...queryForm, ...values, pageNum: 1}
        loadSeries()
    }

    const onResetQuery = () => {
        doQuery({} as SeriesQueryForm)
    }

    const onDeleteSeries = (seriesIds: number[]) => {
        setTableOption({...tableOption, loading: true})
        seriesService.deleteSeries(seriesIds).then(resp => {
            message.info(resp.msg)
            loadSeries()
        }).finally(() => setTableOption({...tableOption, loading: false}))
    }

    const loadSeries = () => {
        setTableOption({...tableOption,loading: true})
        seriesService.querySeries(queryForm).then((res) => {
            setTableOption({...tableOption, datasource: res.data,total: res.total||0,currentPage: res.pageNum||1,loading: false})
        }).catch(()=>setTableOption({...tableOption,loading: false}))
    }

    const rowSelection = {
        selectedRowKeys: tableOption.selectedRowKeys, //加上这才会清除选中缓存
        onChange: (selectedRowKeys: React.Key[]) => {
            setTableOption({...tableOption, selectedRowKeys: selectedRowKeys as number[]})
        },
        getCheckboxProps: (record: Series) => ({
            name: record.seriesId,
        }),
    };

    const onPageChange = (page: number, pageSize: number) => {
        queryForm={...queryForm, pageSize: pageSize, pageNum: page}
        loadSeries()
    }

    useEffect(() => {
        loadSeries()
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
                                <Col span={8}>
                                    <Form.Item
                                        name="seriesName"
                                        label="车系名称"
                                    >
                                        <Input placeholder="车系名称" allowClear/>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="brand"
                                        label="品牌">
                                        <Input placeholder="品牌名称" allowClear/>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="grade"
                                        label="级别">
                                        <Input placeholder="级别" allowClear/>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="createdAtRange"
                                        label="创建时间">
                                        <KDateRangePicker/>
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item>
                                        <Button
                                            htmlType="submit"
                                            type="primary"
                                            icon={<SearchOutlined/>}>搜索</Button>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item>
                                        <Button
                                            htmlType="reset"
                                            type="default"
                                            icon={<RedoOutlined/>}>重置</Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Space>
                </Row>
                <Row>
                    <Space>
                        <Button type="primary" onClick={() => openDrawer("new", 0)}
                                icon={<PlusOutlined/>}>新增</Button>
                        <Popconfirm
                            placement="top"
                            title="确认删除"
                            disabled={tableOption.selectedRowKeys.length <= 0}
                            description={"确定要删除" + tableOption.selectedRowKeys.length + "个车系吗？"}
                            onConfirm={() => onDeleteSeries(tableOption.selectedRowKeys)}
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
                        rowKey="seriesId"
                        size="middle"
                        tableLayout="fixed"
                        dataSource={tableOption.datasource}
                        loading={tableOption.loading}
                        pagination={false}
                        rowSelection={{
                            type: "checkbox",
                            ...rowSelection,
                        }}>
                        <Column title="序号" dataIndex="seriesId" key="seriesId" width={80} align="center"
                                render={(_, __: never, index: number,) => (
                                    <>
                                        <span>{index + 1}</span>
                                    </>
                                )}/>
                        <Column title="车系主图" dataIndex="image" key="image" width={80} align="center"
                                render={(image) => (
                                    <>
                                        <Image src={image}
                                               fallback="data:image/png;base64,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"
                                               width={80} height={80}/>
                                    </>
                                )}/>
                        <Column title="车系名称" dataIndex="seriesName" key="brandName" align="center"/>
                        <Column title="品牌" dataIndex="brandName" key="brandName" align="center"/>
                        <Column title="级别" dataIndex="grade" key="grade" align="center"/>
                        <Column title="备注" dataIndex="remark" key="remark" align="center"/>
                        <Column title="创建时间" dataIndex="createdAt" key="createdAt" align="center"/>

                        <Column
                            title="操作"
                            key="action"
                            align="center"
                            width={120}
                            render={(_: string, series: Series) => (
                                <Space size="middle">
                                    <a onClick={() => openDrawer("edit", series.seriesId as number)}><FormOutlined
                                        title="编辑"/></a>
                                    <Popconfirm
                                        placement="top"
                                        title="确认删除"
                                        description={"确定要删除【" + series.seriesName + "】车系吗？"}
                                        onConfirm={() => onDeleteSeries([series.seriesId as number])}
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
                width={720}
                onClose={onDrawerClose}
                open={drawerOption.open}
                bodyStyle={{paddingBottom: 80}}
                extra={
                    <Space>
                        <Button onClick={onDrawerClose}>取消</Button>
                        <Button onClick={onSaveSeries} type="primary">保存</Button>
                    </Space>
                }
            >

                <SeriesForm ref={formRef} formData={formData} loading={drawerOption.loading} mode={formMode}/>
            </Drawer>
        </>
    )
}

export default SeriesManagement