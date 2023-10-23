import {
    Button,
    Drawer,
    Row,
    Space,
    Table,
    message,
    Pagination,
    Form,
    Col,
    Input,
    Popconfirm, Select
} from "antd";
import {
    PlusOutlined,
    MinusOutlined,
    DeleteOutlined,
    PictureOutlined,
    FormOutlined,
} from "@ant-design/icons";
import React, {useEffect, useState} from "react"


import ItemSpecForm from "@/views/prod/components/ItemSpecForm.tsx";
import * as specService from "@/service/item-spec-service.ts";
import KDateRangePicker from "@/components/KDateRangePicker.tsx";
import {ItemSpec, ItemSpecQueryForm} from "@/models/item-spec-model.ts";

import {useParamContext} from "@/store/sys-param-context.tsx";
import {mergedItemSpecParam} from "@/views/prod/components/item-spec-param-helper.ts";
import {Series} from "@/models/item-common-model.ts";
import KDatePicker from "@/components/KDatePicker.tsx";
import ItemSpecImageForm from "@/views/prod/components/ItemSpecImageForm.tsx";

const {Column} = Table;


type FormMode = "new" | "edit"

interface FormRef {
    validate: () => Promise<ItemSpec>
    getData: () => ItemSpec[]
}


export default function ItemSpecManagement() {

    const {carConfigTemplate} = useParamContext()

    const [drawerOption, setDrawerOption] = useState({
        open: false,
        title: "添加商品",
        mode: "new" as FormMode,
        loading: false,
    })
    const [imageDrawerOption,setImageDrawerOption]=useState({
        open:false,
        title:"商品图片",
        loading:false,
        specId:"",
    })
    const [formState, setFormState] = useState<ItemSpec>()
    const [selectionType] = useState<'checkbox' | 'radio'>('checkbox');
    const [formMode, setFormMode] = useState<FormMode>("new")
    const formRef = React.createRef<FormRef>()

    const [tableOption, setTableOption] = useState({
        datasource: [] as ItemSpec[], total: 0, currentPage: 1, selectedRowKeys: [] as string[], loading: false
    })

    const {brands} = useParamContext()
    const [seriesOption, setSeriesOption] = useState<Series[]>()
    let queryForm: ItemSpecQueryForm = {
        pageNum: 1,
        pageSize: 10,
    }
    const doQuery = (values: ItemSpecQueryForm) => {
        queryForm = {...queryForm, ...values, pageNum: 1}
        loadSpecs()
    }

    const onResetQuery = () => {
        doQuery({} as ItemSpecQueryForm)
    }

    const openDrawer = (mode: FormMode, specId: string) => {
        setFormMode(mode)
        console.log("open drawer,mode", formMode)
        if (mode == "edit") {
            setDrawerOption({...drawerOption, title: "修改商品规格", open: true, loading: true})
            specService.getSpec(specId).then(resp => {
                console.log("resp:", resp)
                if (resp.data) {
                    setFormState({...resp.data, params: mergedItemSpecParam(carConfigTemplate, resp.data.params || [])})
                }
            }).finally(() => setDrawerOption({...drawerOption, title: "修改商品规格", open: true, loading: false}))
        } else {
            setFormState({params: mergedItemSpecParam(carConfigTemplate, [])} as ItemSpec)
            setDrawerOption({...drawerOption, title: "添加商品规格", open: true})
            console.log("new form:", drawerOption)
        }

    }
    const onDrawerClose = () => {
        setDrawerOption({...drawerOption, open: false})
    }


    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: ItemSpec[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setTableOption({...tableOption, selectedRowKeys: selectedRowKeys as string[]})
        },
        getCheckboxProps: (record: ItemSpec) => ({
            name: record.specId,
        }),
    };
    const loadSpecs = () => {
        specService.querySpecs(queryForm).then((res) => {
            setTableOption({...tableOption, datasource: res.data, total: res.total || 0, currentPage: res.pageNum || 1,})
        })
    }


    const onPageChange = (page: number, pageSize: number) => {
        queryForm = {...queryForm, pageSize: pageSize, pageNum: page}
        loadSpecs()
    }

    useEffect(() => {
        loadSpecs()
    }, []);


    const onSaveRes = () => {
        formRef.current?.validate().then((values) => {
            if (formMode == "new") {
                specService.createSpec(values).then(() => {
                    message.info("添加商品规格成功")
                    setDrawerOption({...drawerOption, open: false})
                    loadSpecs()
                }).catch(() => {
                    // setDrawerOption({...drawerOption, open: false})
                })
            } else {
                values.specId = formState?.specId || ""
                specService.updateSpec(values).then(() => {
                    message.info("修改商品规格成功")
                    setDrawerOption({...drawerOption, open: false})
                    loadSpecs()
                }).catch(() => {
                    // setDrawerOption({...drawerOption, open: false})
                })
            }
        }).catch(e => {
            console.log("validate error:", e)
        })

    }

    const onDeleteItems = (specIds: string[]) => {
        setTableOption({...tableOption, loading: true})
        specService.deleteSpecs(specIds).then(resp => {
            message.info(resp.msg)
            loadSpecs()
        }).finally(() => setTableOption({...tableOption, loading: false}))
    }
    const onImageDrawerClose = ()=>{
        setImageDrawerOption({...imageDrawerOption,open:false ,specId: ""})
    }

    return (
        <>
            <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                <Row gutter={24}>
                    <Form
                        style={{padding: 24, maxWidth: "none"}}
                        labelCol={{span: 6}}
                        wrapperCol={{span: 18}}
                        onFinish={doQuery}
                        onReset={onResetQuery}>
                        <Row>
                            <Col span={8}>
                                <Form.Item
                                    label="品牌"
                                    name="brandIds"
                                >
                                    <Select mode="multiple" options={brands}
                                            fieldNames={{label: "brandName", value: "brandId"}} allowClear
                                            onChange={(value: number[]) => {
                                                const series:Series[] = []
                                                value.forEach(id=>{
                                                    const b = brands.find(e => e.brandId === id)
                                                    if(b?.series)series.push(...b.series)
                                                })
                                                setSeriesOption(series)
                                            }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="车系"
                                    name="seriesIds">
                                    <Select mode="multiple" options={seriesOption}
                                            fieldNames={{label: "seriesName", value: "seriesId"}} allowClear/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="年份"
                                    name="year">
                                    <KDatePicker picker="year" format={"YYYY"}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="创建时间"
                                    name="createdAtRange">
                                    <KDateRangePicker/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="车型"
                                    name="model">
                                    <Input allowClear/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item style={{marginLeft: 10}}>
                                    <Space>
                                        <Button htmlType="submit" type="primary">查询</Button>
                                        <Button htmlType="reset">重置</Button>
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Row>

                <Row>
                    <Space>

                        <Button type="primary" onClick={() => openDrawer("new", "")}
                                icon={<PlusOutlined/>}>新增</Button>
                        <Popconfirm
                            placement="top"
                            title="确认删除"
                            disabled={tableOption.selectedRowKeys.length <= 0}
                            description={"确定要删除" + tableOption.selectedRowKeys.length + "个用户吗？"}
                            onConfirm={() => onDeleteItems(tableOption.selectedRowKeys)}
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
                        size="large"
                        rowKey="specId"
                        tableLayout="fixed"
                        dataSource={tableOption.datasource}
                        rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }}>
                        <Column title="品牌" dataIndex="brandName" key="brandName"/>
                        <Column title="车系" dataIndex="seriesName" key="seriesName"/>
                        <Column title="年份" dataIndex="year" key="year"/>
                        <Column title="车型" dataIndex="model" key="model"/>

                        <Column
                            title="操作"
                            key="action"
                            fixed="right"
                            render={(_: string, itemSpec: ItemSpec) => (
                                <Space size="middle">
                                    <a key="edit" title="编辑规格"
                                       onClick={() => openDrawer("edit", itemSpec.specId as string)}><FormOutlined/></a>
                                    <a title="规格图片"
                                    onClick={()=>setImageDrawerOption({...imageDrawerOption,open: true,specId:itemSpec.specId as string})}
                                    ><PictureOutlined/></a>
                                    <a title="删除"><DeleteOutlined/></a>
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
                        <Button onClick={onSaveRes} type="primary">
                            提交
                        </Button>
                    </Space>
                }
            >
                <ItemSpecForm ref={formRef} loading={drawerOption.loading} mode={drawerOption.mode}
                              formState={formState}/>
            </Drawer>
            <Drawer
                title={imageDrawerOption.title}
                width={720}
                onClose={onImageDrawerClose}
                open={imageDrawerOption.open}
                bodyStyle={{paddingBottom: 80}}
                extra={
                    <Space>
                        <Button type="primary" onClick={onImageDrawerClose}>完成</Button>
                    </Space>
                }
            >
                <ItemSpecImageForm  specId={imageDrawerOption.specId} />
            </Drawer>
        </>
    )
}
