import {Button, Drawer, message, Popconfirm, Row, Space, Table} from "antd";

import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {ParamItem, SysParam, SysParamType} from "@/models/sys-param-model.ts";
import {useForm} from "antd/es/form/Form";

import * as paramService from "@/service/sys-param-service.ts"
import {
    DeleteOutlined,
    FormOutlined,
    MinusOutlined,
    PlusOutlined,
    ShareAltOutlined,
    SyncOutlined
} from "@ant-design/icons";

import ParamItemForm from "@/views/system/components/ParamForm.tsx";


const {Column} = Table

interface FormRef {
    validate: () => Promise<ParamItem>
    getData: () => ParamItem
}

type ParamItemFormProps = {
    paramId?: string
}

const ParamItemManagement = forwardRef(({paramId}: ParamItemFormProps, ref) => {
    const [drawerOption, setDrawerOption] = useState({
        title: "添加条目",
        open: false,
        loading: false,

    })

    const [form] = useForm()
    const [loading, setLoading] = useState(false)
    const [formMode, setFormMode] = useState<"new" | "edit">("new")
    const formRef = React.createRef<FormRef>()
    const [formData, setFormData] = useState<ParamItem>({})
    const [dataSource, setDataSource] = useState<ParamItem[]>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
    useImperativeHandle(ref, () => ({
        validate: form.validateFields,
        getData: form.getFieldsValue
    }))

    useEffect(() => {
        loadItems()
    }, [paramId]);
    const loadItems = () => {
        if (paramId) {
            setLoading(true)
            paramService.getItemsOfParam(paramId).then(resp => {
                setDataSource(resp.data)
            }).finally(() => setLoading(false))
        }
    }

    const onDeleteItem = (itemIds: string[]) => {
        setLoading(true)
        paramService.deleteItems(itemIds).then(resp => {
            message.info(resp.msg)
            loadItems()
        }).finally(() => setLoading(false))
    }


    const openDrawer = (mode: "new" | "edit", itemId: string) => {
        setFormMode(mode)
        if (mode == "edit") {
            setDrawerOption({...drawerOption, title: "修改条目", open: true, loading: true})
            paramService.getItem(itemId).then(resp => {
                console.log("resp:", resp)
                if (resp.data) {
                    setFormData(resp.data)
                    setDrawerOption({...drawerOption, loading: false, open: true})
                }
            })//.catch(() => setDrawerOption({...drawerOption,loading:false}))
        } else {
            setFormData({parentId: itemId, valueType: SysParamType.string})
            setDrawerOption({...drawerOption, title: "添加条目", open: true})
        }
    }
    const onDrawerClose = () => {
        setDrawerOption({...drawerOption, open: false})
    }

    const onSaveItems = () => {

        formRef.current?.validate().then((values) => {

            if (formMode == "new") {

                setDrawerOption({...drawerOption, open: true})
                values.paramId = paramId
                paramService.createItem(values).then(() => {
                    message.info("添加条目成功")
                    setDrawerOption({...drawerOption, open: false})
                    loadItems()
                }).finally(() => {
                    // setDrawerOption({...drawerOption, open: false})
                })
            } else {
                setDrawerOption({...drawerOption, open: true})
                values.itemId = formData?.itemId || ""
                values.paramId = formData?.paramId
                paramService.updateItem(values).then(() => {
                    message.info("修改条目成功")
                    setDrawerOption({...drawerOption, open: false})
                    loadItems()
                }).catch(() => {
                    // setDrawerOption({...drawerOption, open: false})
                })
            }
        }).catch(e => {
            console.log("validate error:", e)
        })


    }

    const rowSelection = {
        selectedRowKeys, //加上这才会清除选中缓存
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(selectedRowKeys as string[])
        },
        getCheckboxProps: (record: SysParam) => ({
            name: record.paramId,
        }),
    };
    return (
        <>
            <Space direction="vertical">
                <Row>
                    <Space>
                        <Button type="primary" icon={<PlusOutlined/>}
                                onClick={() => openDrawer("new", "root")}>添加 </Button>
                        <Popconfirm
                            placement="top"
                            title="确认删除"
                            description={"确定要删除选中的" + selectedRowKeys.length + "个条目吗？"}
                            onConfirm={() => onDeleteItem(selectedRowKeys)}
                            okText="是"
                            cancelText="否"
                        >
                            <Button type="primary" danger icon={<MinusOutlined/>}>删除</Button>
                        </Popconfirm>

                        <Button type="default" icon={<SyncOutlined/>} onClick={() => loadItems()}>刷新</Button>
                    </Space>
                </Row>
                <Row>
                    <Table
                        size="small"
                        rowKey="itemId"
                        style={{width:"100%"}}
                        // scroll={{x: 500}}
                        pagination={false}
                        tableLayout="fixed"
                        indentSize={30}
                        loading={loading}
                        dataSource={dataSource}
                        rowSelection={{
                            type: "checkbox",
                            ...rowSelection,
                        }}>
                        <Column title="条目名称" dataIndex="itemName" key="itemName"/>
                        <Column title="键名" dataIndex="itemKey" key="itemKey"/>
                        <Column title="键值类型" dataIndex="valueType" key="valueType"/>
                        <Column title="键值" dataIndex="itemValue" key="itemValue"/>
                        <Column title="描述" dataIndex="description" key="description" ellipsis/>
                        <Column title="创建时间" dataIndex="createdAt" key="createdAt"/>
                        <Column
                            title="操作"
                            key="action"
                            align="center"
                            width={120}
                            render={(_: string, item: ParamItem) => (
                                <Space size="middle">
                                    <a onClick={() => openDrawer("edit", item.itemId as string)}>
                                        <FormOutlined title="编辑"/>
                                    </a>
                                    <a onClick={() => openDrawer("new", item.itemId as string)}>
                                        <ShareAltOutlined title="添加子条目"/>
                                    </a>
                                    <Popconfirm
                                        placement="top"
                                        title="确认删除"
                                        description={"确定要删除【" + item.itemName + "】条目吗？"}
                                        onConfirm={() => onDeleteItem([item.itemId as string])}
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
                title={drawerOption.title}
                width={"50%"}
                onClose={onDrawerClose}
                open={drawerOption.open}
                bodyStyle={{paddingBottom: 80}}
                extra={
                    <Space>
                        <Button onClick={onDrawerClose}>取消</Button>
                        <Button onClick={onSaveItems} type="primary">保存</Button>
                    </Space>
                }
            >

                <ParamItemForm ref={formRef} allItems={dataSource} formData={formData} loading={drawerOption.loading}
                               mode={formMode}/>
            </Drawer>
        </>
    )
})

export default ParamItemManagement